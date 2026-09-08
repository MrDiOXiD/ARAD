import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './entities/otp.entity';
import { OtpService } from './services/otp.service';
import { KavenegarService } from './services/kavenegar.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  providers: [OtpService, KavenegarService],
  exports: [OtpService], // UsersModule needs this injected
})
export class OtpModule {}
