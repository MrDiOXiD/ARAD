import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressEntity } from './entities/user-address.entity';
import { UserAddressesService } from './services/user-addresses.service';
import { UserAddressesController } from './controllers/user-addresses.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAddressEntity]),
  ],
  controllers: [UserAddressesController],
  providers: [UserAddressesService],
})
export class AddressesModule {}
