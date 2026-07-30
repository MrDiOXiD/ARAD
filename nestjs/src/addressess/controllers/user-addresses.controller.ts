import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAddressesService } from '../services/user-addresses.service';
import { CreateUserAddressDto, UpdateUserAddressDto } from '../dto/user-address.dto';
import { CurrentUser } from '../../utils/decorators/currentUser.decorator';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { UserEntity } from '@/users/entities/user.entity';

@ApiTags('User Addresses')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard)
@Controller('user/addresses')
export class UserAddressesController {
  constructor(private readonly addressesService: UserAddressesService) {}

  @Get()
  @ApiOperation({ summary: "List the current user's saved addresses" })
  @ApiOkResponse({ description: 'Successfully retrieved addresses.' })
  async findAll(@CurrentUser() user: UserEntity) {
    return this.addressesService.findAllForUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Save a new address for the current user' })
  @ApiCreatedResponse({ description: 'Address created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  async create(@CurrentUser() user: UserEntity, @Body() dto: CreateUserAddressDto) {
    return this.addressesService.create(user, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one of the current user\'s addresses' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiOkResponse({ description: 'Address updated.' })
  @ApiResponse({ status: 404, description: 'Not Found. No such address on this account.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateUserAddressDto,
  ) {
    return this.addressesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one of the current user\'s addresses' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiOkResponse({ description: 'Address deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found. No such address on this account.' })
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: UserEntity) {
    await this.addressesService.remove(id, user.id);
    return { deleted: true };
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Mark one address as the default for checkout' })
  @ApiParam({ name: 'id', type: 'integer', example: 1 })
  @ApiOkResponse({ description: 'Default address updated.' })
  @ApiResponse({ status: 404, description: 'Not Found. No such address on this account.' })
  async setDefault(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: UserEntity) {
    return this.addressesService.setDefault(id, user.id);
  }
}
