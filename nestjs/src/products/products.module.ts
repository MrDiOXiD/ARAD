import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controller/products.controller';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    // UserEntity belongs to UsersModule — don't register foreign entities here.
    // Importing UsersModule gives access to UserService and the JwtModule exports.
    forwardRef(() => CategoriesModule), // circular: Categories ↔ Products
    forwardRef(() => UsersModule),
    // MulterModule removed — multerConfig is passed per-interceptor in the controller,
    // which is safer (different routes can have different limits)
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
