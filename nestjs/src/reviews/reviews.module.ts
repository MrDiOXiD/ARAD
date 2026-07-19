// src/reviews/reviews.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './controller/reviews.controller'; // Ensure path is correct
import { ReviewsService } from './services/reviews.service';
import { ReviewEntity } from './entities/review.entity';
import { ProductEntity } from '@/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, ProductEntity]) 
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}