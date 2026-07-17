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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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
  //making swagger able to handle the pictures
@ApiOperation({ summary: 'Create a new product with optional discounts' })
  // 2. 👇 Tell Swagger we are sending multipart/form-data
  @ApiConsumes('multipart/form-data')@ApiBody({
    schema: {
      type: 'object',
      // Mark only the essential fields as required
      required: ['title', 'description', 'price', 'stock', 'categoryId', 'productImage'],
      properties: {
        title: { 
          type: 'string', 
          minLength: 2, 
          maxLength: 200, 
          example: 'Premium Wireless Headphones' 
        },
        description: { 
          type: 'string', 
          minLength: 10, 
          maxLength: 500, 
          example: 'High-quality over-ear headphones with noise cancellation.' 
        },
        price: { 
          type: 'number', 
          minimum: 0, 
          example: 149.99 
        },
        stock: { 
          type: 'number', 
          minimum: 0, 
          example: 25 
        },
        categoryId: { 
          type: 'number', 
          minimum: 1, 
          example: 3 
        },
        // 🌟 NEW: Discount field (0 to 100%)
        discount: { 
          type: 'number', 
          minimum: 0, 
          maximum: 100, 
          default: 0, 
          example: 15, 
          description: 'Percentage discount (e.g., 15 for 15% off)' 
        },
        // 🌟 NEW: Discount Start Date (ISO-8601 Date format)
        discountStartDate: { 
          type: 'string', 
          format: 'date-time', 
          example: '2026-07-17T00:00:00.000Z', 
          description: 'When the discount starts' 
        },
        // 🌟 NEW: Discount End Date (ISO-8601 Date format)
        discountEndDate: { 
          type: 'string', 
          format: 'date-time', 
          example: '2026-07-24T23:59:59.000Z', 
          description: 'When the discount expires' 
        },
        // 🌟 NEW: Active Status (Accepts boolean or "true"/"false" strings)
        isActive: { 
          type: 'boolean', 
          default: true, 
          example: true, 
          description: 'Is the product available for customers to view and buy?' 
        },
        // 🖼️ The File Upload field (this renders the "Choose File" button)
        productImage: {
          type: 'string',
          format: 'binary',
          description: 'The product image file to upload to ArvanCloud',
        },
      },
    },
  })
  // Pass multerConfig directly to the interceptor — not globally via MulterModule
  @UseInterceptors(FileInterceptor("productImage", multerConfig))
  async createProduct(
    @UploadedFile() productImage: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    if (!productImage) {
      throw new BadRequestException("Product image is required");
    }
    return this.productsService.createProduct(createProductDto, productImage, currentUser);
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
