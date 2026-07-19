import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as cloudinary from "cloudinary";

import { ProductEntity } from "../entities/product.entity";
import { CreateProductDto } from "../dto/create-product.dto";

import { CategoriesEntity } from "../../categories/entities/category.entity";
import { CategoriesService } from "../../categories/services/categories.service";
import { OrderStatus } from "../../utils/common/order.enum";
import { normalizeError } from "../../utils/errors/normalize-error.util";
import { UpdateProductDto } from "../dto/update-product.dto";
import { UserEntity } from "@/users/entities/user.entity";
import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { extname } from "path";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly s3Client: S3Client;
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoriesService: CategoriesService,
  ) {
    //-------arvan(cloudinary)---------------------------------------------------
    // This makes sure NestJS doesn't try to inject it as a provider!
    this.s3Client = new S3Client({
      region: "us-east-1",
      endpoint: process.env.ARVAN_ENDPOINT,
      credentials: {
        accessKeyId: process.env.ARVAN_ACCESS_KEY || "",
        secretAccessKey: process.env.ARVAN_SECRET_KEY || "",
      },
      forcePathStyle: true,
    });
  }

  // ── Create ────────────────────────────────────────────────────────────────

  async createProduct(
    dto: CreateProductDto,
    productImage: Express.Multer.File,
    galleryImages: Express.Multer.File[],
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    try {
      const category = await this.categoriesService.findCategoryById(+dto.categoryId);
      const { secure_url, public_id } = await this.uploadProductImage(productImage);
      let galleryUploads: { secure_url: string; public_id: string; }[] = [];
      if (galleryImages && galleryImages.length > 0) {
        galleryUploads = await Promise.all(
          galleryImages.map((file) => this.uploadProductImage(file)),
        );
      }
      const product = this.productRepository.create({
        title: dto.title,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        category,
        createdBy: currentUser,
        productImage: secure_url,
        imagePublicId: public_id,
        gallery: galleryUploads, 
        discount: dto.discount ?? 0,
        discountStartDate: dto.discountStartDate || null,
        discountEndDate: dto.discountEndDate || null,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        brand: dto.brand,
        badge: dto.badge,
        attributes: dto.attributes,
      });

      return this.productRepository.save(product);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error; // re-throw known HTTP exceptions as-is
      }
      const err = normalizeError(error);
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException("Failed to create product");
    }
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { createdBy: true, category: true },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async findAll(page = 1, limit = 10): Promise<ProductEntity[]> {
    const skip = (page - 1) * limit;
    return this.productRepository.find({ skip, take: limit });
  }

  async findByCategoryId(categoryId: number): Promise<ProductEntity[]> {
    return this.productRepository.find({ where: { categoryId } });
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async update(id: number, dto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.findOne(id);

    // ── Scalar fields: use actual ProductEntity property names ──
    // ERROR WAS HERE: 'name' does not exist — the field is 'title'
    if (dto.title !== undefined) product.title = dto.title;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.description !== undefined) product.description = dto.description;

    // ── Category: delegate to categoriesService — no categoryRepository needed ──
    // ERROR WAS HERE: this.categoryRepository does not exist on ProductsService
    if (dto.categoryId !== undefined) {
      const category = await this.categoriesService.findCategoryById(dto.categoryId);
      product.category = category;
      product.categoryId = category.id;
    }

    return this.productRepository.save(product);
  }

  async updateStock(id: number, stockChange: number, status: string): Promise<ProductEntity> {
    try {
      const product = await this.findOne(id);

      const adjustment = status === OrderStatus.DELIVERED ? -stockChange : stockChange;

      if (product.stock + adjustment < 0) {
        throw new BadRequestException("Insufficient stock available");
      }

      product.stock += adjustment;
      return this.productRepository.save(product);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      const err = normalizeError(error);
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException("Failed to update stock");
    }
  }

  async updateProductsByCategoryId(categoryId: number, category: CategoriesEntity): Promise<void> {
    const products = await this.findByCategoryId(categoryId);
    if (products.length === 0) return; // nothing to update — not an error

    products.forEach((p) => {
      p.category = category;
    });
    await this.productRepository.save(products);
  }

  async removeCategoryFromProductsByCategoryId(categoryId: number): Promise<void> {
    const products = await this.productRepository.find({ where: { categoryId } });
    if (products.length === 0) return;

    products.forEach((p) => {
      p.categoryId = null;
    });
    await this.productRepository.save(products);
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  // async delete(id: number): Promise<{ message: string }> {
  //   const product = await this.findOne(id);

  //   if (product.imagePublicId) {
  //     await cloudinary.v2.uploader.destroy(product.imagePublicId);
  //   }

  //   await this.productRepository.remove(product);
  //   return { message: `Product ${id} deleted successfully` };
  // }

  // async saveProduct(product: ProductEntity): Promise<ProductEntity> {
  //   return this.productRepository.save(product);
  // }
  async delete(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);

    // 3. 👇 Swapped Cloudinary delete with S3/ArvanCloud delete
    if (product.imagePublicId) {
      try {
        const bucketName = process.env.ARVAN_BUCKET_NAME;
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: product.imagePublicId, // In our upload, we saved the file key as public_id
          }),
        );
      } catch (err) {
        // Log the error but don't prevent database record deletion if file was already missing
        this.logger.error(`Failed to delete image from ArvanCloud: ${product.imagePublicId}`, err);
      }
    }

    await this.productRepository.remove(product);
    return { message: `Product ${id} deleted successfully` };
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  // private async uploadProductImage(
  //   imageFile: Express.Multer.File,
  // ): Promise<{ secure_url: string; public_id: string }> {
  //   try {
  //     return await cloudinary.v2.uploader.upload(imageFile.path, {
  //       folder: "product_images",
  //     });
  //   } catch (error) {
  //     const err = normalizeError(error);
  //     this.logger.error(`Cloudinary upload failed: ${err.message}`, err.stack);
  //     throw new InternalServerErrorException("Image upload failed");
  //   }
  // }
  //-----cloudinary-------------------------------------------------------------
  async uploadProductImage(
    file: Express.Multer.File,
  ): Promise<{ secure_url: string; public_id: string }> {
    const bucketName = process.env.ARVAN_BUCKET_NAME;
    if (!bucketName) {
      throw new InternalServerErrorException("ArvanCloud bucket name is not configured in .env");
    }

    // Generate a secure, unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const key = `products/${uniqueSuffix}${ext}`; // This acts as our "public_id"

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer, // We read the file stream directly from memory
        ContentType: file.mimetype, // Ensures the browser displays it instead of downloading it
        ACL: "public-read", // Makes the file publicly viewable
      });

      // Send the file to ArvanCloud
      await this.s3Client.send(command);

      // Construct the public access URL
      // Format: https://[bucket-name].s3.ir-thr-at1.arvanstorage.ir/[key]
      const endpointDomain = process.env.ARVAN_ENDPOINT?.replace(/^https?:\/\//, "");
      const secure_url = `https://${bucketName}.${endpointDomain}/${key}`;

      return {
        secure_url, // Saved in your 'productImage' column
        public_id: key, // Saved in your 'imagePublicId' column (useful if you ever want to delete it!)
      };
    } catch (error) {
      this.logger.error("ArvanCloud Upload Error details:", error);
      throw new InternalServerErrorException("Image upload to ArvanCloud failed");
    }
  }
}
