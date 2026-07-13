import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import * as cloudinary from 'cloudinary';

import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { typeOrmCOnfig } from './config/DB.config';
import { CurrentUserMiddleware } from './utils/middleware/currentUser.middleware';
import { CompressionMiddleware } from './utils/middleware/compression.middleware';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // ConfigModule MUST come first — TypeOrm config reads env vars through it
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot(typeOrmCOnfig),

    ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }]),

    UsersModule,
    AuditModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    // ProductsModule, CategoriesModule, OrdersModule — add back when ready
  ],
  // ConfigService is already provided globally by ConfigModule — remove duplicate
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  // OnModuleInit runs after DI is set up — safe place to configure cloudinary
  onModuleInit() {
    const cloudName  = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey     = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret  = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        'Cloudinary config incomplete — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET',
      );
    }

    cloudinary.v2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      // Compression first — reduces bytes before any business logic runs
      .apply(CompressionMiddleware, CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
