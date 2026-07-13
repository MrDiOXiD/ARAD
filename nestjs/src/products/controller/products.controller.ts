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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CacheTTL } from '@nestjs/cache-manager';

import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { AuthorizedGuard } from '../../utils/guard/authorized-role.guard';
import { CurrentUser } from '../../utils/decorators/currentUser.decorator';
import { Roles } from '../../utils/common/Roles.enum';
import { multerConfig } from '../../utils/middleware/multer';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UserEntity } from '@/users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Post()
  // Pass multerConfig directly to the interceptor — not globally via MulterModule
  @UseInterceptors(FileInterceptor('productImage', multerConfig))
  async createProduct(
    @UploadedFile() productImage: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    return this.productsService.createProduct(createProductDto, productImage, currentUser);
  }

  @Get()
  @CacheTTL(86400000)
  async findAll(
    @Query('page',  new DefaultValuePipe(1),  ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ProductEntity[]> {
    return this.productsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.productsService.delete(id);
  }
}
