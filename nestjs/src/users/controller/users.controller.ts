/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserService } from '../services/users.service';
import { Public } from '../../utils/decorators/authPublic.decorators';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { AuthorizedGuard } from '../../utils/guard/authorized-role.guard';
import { Roles } from '../../utils/common/Roles.enum';
import { Request as ExpressRequest } from 'express';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Register a new user
  @Public()
  @Post('register')
  async register(@Body() body: SignupDto) {
    return await this.userService.signup(body);
  }

  // User login
  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto, @Req() req: ExpressRequest) {
    const clientIp =
      req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

    return await this.userService.signIn(body, clientIp);
  }
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get()
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserById(id);
  }
}
