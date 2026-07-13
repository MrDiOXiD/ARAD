import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as cloudinary from 'cloudinary';

import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

import { CategoriesEntity } from '../../categories/entities/category.entity';
import { CategoriesService } from '../../categories/services/categories.service';
import { OrderStatus } from '../../utils/common/order.enum';
import { normalizeError } from '../../utils/errors/normalize-error.util';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UserEntity } from '@/users/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoriesService: CategoriesService,
  ) {}

  // ── Create ────────────────────────────────────────────────────────────────

  async createProduct(
    dto: CreateProductDto,
    productImage: Express.Multer.File,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    try {
      const category = await this.categoriesService.findCategoryById(+dto.categoryId);
      const { secure_url, public_id } = await this.uploadProductImage(productImage);

      const product = this.productRepository.create({
        title:        dto.title,
        description:  dto.description,
        price:        dto.price,
        stock:        dto.stock,
        category,
        createdBy:    currentUser,
        productImage: secure_url,
        imagePublicId: public_id,
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
      throw new InternalServerErrorException('Failed to create product');
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
    if (dto.title       !== undefined) product.title       = dto.title;
    if (dto.price       !== undefined) product.price       = dto.price;
    if (dto.stock       !== undefined) product.stock       = dto.stock;
    if (dto.description !== undefined) product.description = dto.description;

    // ── Category: delegate to categoriesService — no categoryRepository needed ──
    // ERROR WAS HERE: this.categoryRepository does not exist on ProductsService
    if (dto.categoryId !== undefined) {
      const category = await this.categoriesService.findCategoryById(dto.categoryId);
      product.category   = category;
      product.categoryId = category.id;
    }

    return this.productRepository.save(product);
  }

  async updateStock(
    id: number,
    stockChange: number,
    status: string,
  ): Promise<ProductEntity> {
    try {
      const product = await this.findOne(id);

      const adjustment = status === OrderStatus.DELIVERED ? -stockChange : stockChange;

      if (product.stock + adjustment < 0) {
        throw new BadRequestException('Insufficient stock available');
      }

      product.stock += adjustment;
      return this.productRepository.save(product);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      const err = normalizeError(error);
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException('Failed to update stock');
    }
  }

  async updateProductsByCategoryId(
    categoryId: number,
    category: CategoriesEntity,
  ): Promise<void> {
    const products = await this.findByCategoryId(categoryId);
    if (products.length === 0) return; // nothing to update — not an error

    products.forEach((p) => { p.category = category; });
    await this.productRepository.save(products);
  }

  async removeCategoryFromProductsByCategoryId(categoryId: number): Promise<void> {
    const products = await this.productRepository.find({ where: { categoryId } });
    if (products.length === 0) return;

    products.forEach((p) => { p.categoryId = null; });
    await this.productRepository.save(products);
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async delete(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);

    if (product.imagePublicId) {
      await cloudinary.v2.uploader.destroy(product.imagePublicId);
    }

    await this.productRepository.remove(product);
    return { message: `Product ${id} deleted successfully` };
  }

  async saveProduct(product: ProductEntity): Promise<ProductEntity> {
    return this.productRepository.save(product);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async uploadProductImage(
    imageFile: Express.Multer.File,
  ): Promise<{ secure_url: string; public_id: string }> {
    try {
      return await cloudinary.v2.uploader.upload(imageFile.path, {
        folder: 'product_images',
      });
    } catch (error) {
      const err = normalizeError(error);
      this.logger.error(`Cloudinary upload failed: ${err.message}`, err.stack);
      throw new InternalServerErrorException('Image upload failed');
    }
  }
}
