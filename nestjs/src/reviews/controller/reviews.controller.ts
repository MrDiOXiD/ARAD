import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ReviewsService } from "../services/reviews.service"; // Ensure correct path
import { AuthenticationGuard } from "../../utils/guard/auth.guard";
import { AuthorizedGuard } from "../../utils/guard/authorized-role.guard";
import { CurrentUser } from "../../utils/decorators/currentUser.decorator";
import { Roles } from "../../utils/common/Roles.enum";
import { UserEntity } from "@/users/entities/user.entity";
import { ReviewEntity } from "../entities/review.entity";
import { CreateReviewDto } from "../dto/CreateReviewDto";

@ApiTags("reviews")
@ApiBearerAuth()
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 1. PUBLIC: Create a review (Requires user to be logged in)
  @ApiOperation({ summary: "User submits a review for a product" })
  @UseGuards(AuthenticationGuard)
  @Post(":productId")
  async createReview(
    @Param("productId", ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.reviewsService.create(createReviewDto, currentUser, productId);
  }

  // 2. PUBLIC: Get all approved reviews for a specific product
  @ApiOperation({ summary: "Get all approved reviews for a product" })
  @Get("product/:productId")
  async getApprovedReviews(
    @Param("productId", ParseIntPipe) productId: number,
  ): Promise<ReviewEntity[]> {
    return this.reviewsService.findApprovedByProduct(productId);
  }

  // 3. ADMIN: Get all pending reviews for moderation
  @ApiOperation({ summary: "Admin: Get all pending reviews" })
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get("admin/pending")
  async getPendingReviews(): Promise<ReviewEntity[]> {
    return this.reviewsService.findPending();
  }

  // 4. ADMIN: Approve a review
  @ApiOperation({ summary: "Admin: Approve a specific review" })
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Patch("admin/:id/approve")
  async approveReview(@Param("id", ParseIntPipe) id: number) {
    return this.reviewsService.approveReview(id);
  }

  // 5. ADMIN: Delete a review (e.g., if inappropriate)
  @ApiOperation({ summary: "Admin: Delete a specific review" })
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Delete("admin/:id")
  async deleteReview(@Param("id", ParseIntPipe) id: number) {
    return this.reviewsService.deleteReview(id);
  }
}