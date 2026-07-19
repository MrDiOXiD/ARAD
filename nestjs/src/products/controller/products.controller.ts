import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  DefaultValuePipe,
  BadRequestException,
  UploadedFiles,
} from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { CacheTTL } from "@nestjs/cache-manager";

import { ProductsService } from "../services/products.service";
import { CreateProductDto } from "../dto/create-product.dto";
import { ProductEntity } from "../entities/product.entity";
import { AuthenticationGuard } from "../../utils/guard/auth.guard";
import { AuthorizedGuard } from "../../utils/guard/authorized-role.guard";
import { CurrentUser } from "../../utils/decorators/currentUser.decorator";
import { Roles } from "../../utils/common/Roles.enum";
import { multerConfig } from "../../utils/middleware/multer";
import { UpdateProductDto } from "../dto/update-product.dto";
import { UserEntity } from "@/users/entities/user.entity";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
@ApiTags("products")
@ApiBearerAuth()
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Post()
  @ApiOperation({ summary: "Create a new product with optional discounts" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      // Ensure only the strictly required fields are listed here
      required: ["title", "description", "price", "stock", "categoryId", "productImage"],
      properties: {
        title: { type: "string", example: "لامپ LED حبابی ۹ وات" },
        description: { type: "string", example: "لامپ کم مصرف با طول عمر بالا" },
        price: { type: "number", example: 45000 },
        stock: { type: "number", example: 100 },
        categoryId: { type: "number", example: 1 },
        discount: { type: "number", example: 22, description: "Percentage discount" },
        discountStartDate: { type: "string", format: "date-time" },
        discountEndDate: { type: "string", format: "date-time" },
        isActive: { type: "boolean", default: true },

        // 🌟 NEW: Brand
        brand: {
          type: "string",
          example: "پارس شهاب",
          description: "The manufacturer or brand of the product",
        },

        // 🌟 NEW: Badge
        badge: {
          type: "string",
          example: "new",
          description: "Highlight badge (e.g., new, sale, hot)",
        },

        // 🌟 NEW: Dynamic Attributes (JSON String)
        attributes: {
          type: "string",
          example: '{"color": "white", "power": "9W", "warranty": "12 months"}',
          description: "A JSON-stringified object containing dynamic key-value pairs.",
        },

        // 🖼️ Image Upload
       // 🖼️ Primary Image (Single)
        productImage: {
          type: 'string',
          format: 'binary',
          description: 'The primary product image',
        },
        
        // 🖼️🖼️ Gallery Images (Array)
        gallery: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Additional gallery images (Max 5)',
        },
      },
    },
  })
 @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'productImage', maxCount: 1 },
      { name: 'gallery', maxCount: 5 },
    ], multerConfig) 
  )
 async createProduct(
    @UploadedFiles() files: { 
      productImage?: Express.Multer.File[]; 
      gallery?: Express.Multer.File[] 
    },
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    
    const productImage = files.productImage?.[0];
    
    if (!productImage) {
      throw new BadRequestException("Product primary image is required");
    }

    const galleryImages = files.gallery || []; 

    return this.productsService.createProduct(
      createProductDto, 
      productImage, 
      galleryImages, 
      currentUser
    );
  }

  @Get()
  @CacheTTL(86400000)
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ProductEntity[]> {
    return this.productsService.findAll(page, limit);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.productsService.delete(id);
  }
}
