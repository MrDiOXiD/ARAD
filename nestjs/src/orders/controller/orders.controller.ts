import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';

import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatus } from '../dto/update-order-status.dto';
import { CreateShippingDto } from '../dto/shipping.dto';
import { OrderProductDto } from '../dto/order-product.dto';
import { CurrentUser } from '../../utils/decorators/currentUser.decorator';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { Roles } from '../../utils/common/Roles.enum';
import { AuthorizedGuard } from '../../utils/guard/authorized-role.guard';
import { UserEntity } from '@/users/entities/user.entity';

@ApiTags('Orders')
@ApiBearerAuth()
@ApiExtraModels(CreateShippingDto, OrderProductDto)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  // @UseGuards(AuthenticationGuard)
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Creates an order for the current user, including a shipping address and the list of ordered products.',
  })
  @ApiCreatedResponse({ description: 'The order has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token missing or invalid.' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return await this.ordersService.createOrder(createOrderDto, currentUser);
  }

  @Get()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @ApiOperation({
    summary: 'Retrieve all orders',
    description: 'Returns every order in the system. Requires the ADMIN role.',
  })
  @ApiOkResponse({ description: 'Successfully retrieved list of orders.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have ADMIN privileges.' })
  async findAllOrders() {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @ApiOperation({
    summary: 'Retrieve a specific order by ID',
    description: 'Returns full order details for a single order. Requires the ADMIN role.',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'The unique identifier of the order', example: 1 })
  @ApiOkResponse({ description: 'Successfully retrieved the order.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have ADMIN privileges.' })
  @ApiResponse({ status: 404, description: 'Not Found. Order with the specified ID does not exist.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @ApiOperation({
    summary: 'Update an order status',
    description: 'Transitions an order to SHIPPED or DELIVERED. Requires the ADMIN role.',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'The unique identifier of the order to update', example: 1 })
  @ApiOkResponse({ description: 'Successfully updated the order status.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have ADMIN privileges.' })
  @ApiResponse({ status: 404, description: 'Not Found. Order does not exist.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderStatus,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.ordersService.updateOrderStatus(id, updateOrderDto, user);
  }

  @Put('cancel/:id')
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @ApiOperation({
    summary: 'Cancel an order',
    description: 'Cancels an existing order. Requires the ADMIN role.',
  })
  @ApiParam({ name: 'id', type: 'integer', description: 'The unique identifier of the order to cancel', example: 1 })
  @ApiOkResponse({ description: 'Successfully cancelled the order.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have ADMIN privileges.' })
  @ApiResponse({ status: 404, description: 'Not Found. Order does not exist.' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.ordersService.cancelOrder(id, user);
  }
}
