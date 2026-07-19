import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../entities/review.entity';
import { ProductEntity } from '../../products/entities/product.entity'; // Import this
import { UserEntity } from '../../users/entities/user.entity';
import { CreateReviewDto } from '../dto/CreateReviewDto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity) private repo: Repository<ReviewEntity>,
    @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>, // 1. Inject this!
  ) {}

  async create(dto: CreateReviewDto, user: UserEntity, productId: number) {
    const review = this.repo.create({
      ...dto,
      user,
      product: { id: productId },
      isApproved: false,
    });
    return this.repo.save(review);
  }

  async findApprovedByProduct(productId: number) {
    return this.repo.find({
      where: { product: { id: productId }, isApproved: true },
      relations: ['user'],
    });
  }

  // Fixing the calculation method
  async getProductStats(productId: number) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    const approvedReviews = await this.findApprovedByProduct(productId); // 2. Use 'this' instead of 'this.reviewsService'
    
    // 3. Fix types in reduce
    const averageRating = approvedReviews.length > 0 
      ? approvedReviews.reduce((acc: number, r: ReviewEntity) => acc + r.rating, 0) / approvedReviews.length
      : 0;

    return {
      ...product,
      reviews: approvedReviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: approvedReviews.length,
    };
  }
  // Add these inside ReviewsService class
  async findPending() {
    return this.repo.find({ 
      where: { isApproved: false }, 
      relations: ['user', 'product'] // Load relations so Admin knows who/what it is
    });
  }
async approveReview(id: number) {
  // Find the review to ensure it exists, then update it
  const review = await this.repo.findOne({ where: { id } });
  if (!review) {
    throw new NotFoundException(`Review with ID ${id} not found`);
  }
  return this.repo.update(id, { isApproved: true });
}
  async deleteReview(id: number) {
    return this.repo.delete(id);
  }
}