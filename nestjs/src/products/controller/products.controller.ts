import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProductEntity } from '../entities/product.entity';
import { CacheTTL } from '@nestjs/cache-manager';
import { UserEntity } from '../../users/entities/user.entity';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { Roles } from '../../utils/common/Roles.enum';
import { AuthorizedGuard } from '../../utils/guard/authorized-role.guard';
import { CurrentUser } from '../../utils/decorators/currentUser.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Post()
  @UseInterceptors(FileInterceptor('productImage'))
  async createProduct(
    @UploadedFile() productImage: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.productsService.createProduct(
      createProductDto,
      productImage,
      user,
    );
  }

  @Get()
  @CacheTTL(86400000)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ProductEntity[]> {
    return this.productsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }
}
