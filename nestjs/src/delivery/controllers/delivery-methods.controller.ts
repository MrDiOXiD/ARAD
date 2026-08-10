import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDeliveryMethodDto, UpdateDeliveryMethodDto, DeliveryMethodResponseDto } from '../dto/delivery-method.dto';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { AuthorizedGuard } from '../../utils/guard/authorized-role.guard';
import { Roles } from '../../utils/common/Roles.enum';
import { Public } from '../../utils/decorators/authPublic.decorators';
import { DeliveryMethodsService } from '../services/delivery-methods.service';

@ApiTags('Delivery Methods')
@Controller('delivery-methods')
export class DeliveryMethodsController {
  constructor(private readonly service: DeliveryMethodsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List active delivery methods (checkout)' })
  @ApiOkResponse({ type: [DeliveryMethodResponseDto] })
  findAllActive() {
    return this.service.findAllActive();
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get('admin')
  @ApiOperation({ summary: 'Admin: list all delivery methods, including inactive' })
  @ApiOkResponse({ type: [DeliveryMethodResponseDto] })
  findAllForAdmin() {
    return this.service.findAllForAdmin();
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Post('admin')
  @ApiOperation({ summary: 'Admin: create a delivery method' })
  create(@Body() dto: CreateDeliveryMethodDto) {
    return this.service.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Patch('admin/:id(\\d+)')
  @ApiOperation({ summary: 'Admin: update a delivery method (price, active state, etc.)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeliveryMethodDto) {
    return this.service.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Delete('admin/:id(\\d+)')
  @ApiOperation({ summary: 'Admin: delete a delivery method' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { deleted: true };
  }
}
