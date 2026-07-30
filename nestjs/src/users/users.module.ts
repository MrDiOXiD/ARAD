import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UserService } from "./services/users.service";
import { UserController } from "./controller/users.controller";
import { AuditModule } from "../audit/audit.module";
import { UserEntity } from "./entities/user.entity";
import { RefreshTokenEntity } from "./entities/refresh-token.entity";
import { GoogleAuthService } from "./services/google-auth.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]), // add RefreshTokenEntity
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) throw new Error('JWT_SECRET env var is not set');
        return { secret, signOptions: { expiresIn: '15m' } }; // was '1h'
      },
      inject: [ConfigService],
    }),
    ConfigModule,
    AuditModule,
  ],
  providers: [UserService, GoogleAuthService],
  exports: [UserService, PassportModule, JwtModule],
  controllers: [UserController],
})
export class UsersModule {}
