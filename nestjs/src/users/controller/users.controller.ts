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
  NotFoundException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import { SignupDto } from '../dto/signup.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserService, SafeUser } from '../services/users.service';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { Public } from '../../utils/decorators/authPublic.decorators';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { AuthorizedGuard } from '../../utils/guard/authorized-role.guard';
import { Roles } from '../../utils/common/Roles.enum';
import { extractClientIp } from '../../utils/http/extract-client-ip.util';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() body: SignupDto): Promise<SafeUser> {
    return this.userService.signup(body);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: LoginUserDto,
    @Req() req: ExpressRequest,
  ): Promise<AuthResponse> {
    const clientIp = extractClientIp(req);
    return this.userService.signIn(body, clientIp);
  }

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get()
  async findAllUsers(): Promise<SafeUser[]> {
    return this.userService.findAllUsers();
  }

  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    const user = await this.userService.findUserById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    const { password: _omit, ...safe } = user;
    return safe as SafeUser;
  }
}
