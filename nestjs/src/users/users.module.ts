import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserService } from './services/users.service';
import { UserController } from './controller/users.controller';
import { AuditModule } from '../audit/audit.module';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET env var is not set');
        return { secret, signOptions: { expiresIn: '1h' } };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
    // Import AuditModule so its exported AuditService is available here
    // No forwardRef needed — AuditModule doesn't depend on UsersModule
    AuditModule,
  ],
  providers: [UserService],           // AuditService comes from AuditModule
  exports: [UserService, PassportModule, JwtModule],
  controllers: [UserController],
})
export class UsersModule {}
