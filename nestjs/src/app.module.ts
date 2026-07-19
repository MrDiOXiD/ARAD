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

import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { typeOrmCOnfig } from './config/DB.config';
import { CurrentUserMiddleware } from './utils/middleware/currentUser.middleware';
import { CompressionMiddleware } from './utils/middleware/compression.middleware';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // ConfigModule MUST come first — TypeOrm config reads env vars through it
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot(typeOrmCOnfig),

    ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }]),

    UsersModule,
    AuditModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    ReviewsModule
    
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  // OnModuleInit runs after DI is set up — safe place to validate environment variables
  onModuleInit() {
    const requiredArvanEnv = [
      'ARVAN_ENDPOINT',
      'ARVAN_ACCESS_KEY',
      'ARVAN_SECRET_KEY',
      'ARVAN_BUCKET_NAME',
    ];

    for (const envVar of requiredArvanEnv) {
      if (!process.env[envVar]) {
        throw new Error(
          `ArvanCloud config incomplete — please set ${envVar} in your .env file`,
        );
      } // <-- Safely closed the IF statement
    } // <-- Safely closed the FOR loop
  } // <-- Safely closed the onModuleInit method

  configure(consumer: MiddlewareConsumer) {
    consumer
      // Compression first — reduces bytes before any business logic runs
      .apply(CompressionMiddleware, CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}