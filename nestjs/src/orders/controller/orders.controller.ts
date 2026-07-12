import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatus } from '../dto/update-order-status.dto';
import { UserEntity } from '../../users/entities/user.entity';
import { CurrentUser } from '../../utils/decorators/currentUser.decorator';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { Roles } from '../../utils/common/Roles.enum';
import { AuthorizedGuard } from '../../utils/guard/authorized-role.guard';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    const order = await this.ordersService.createOrder(
      createOrderDto,
      currentUser,
    );
    return order;
  }

  @Get()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  async findAllOrders() {
    return await this.ordersService.findAll();
  }
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(+id);
  }
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderStatus,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.ordersService.updateOrderStatus(
      +id,
      updateOrderDto,
      user,
    );
  }
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Put('cancel/:id')
  async cancel(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return await this.ordersService.cancelOrder(+id, user);
  }
}
