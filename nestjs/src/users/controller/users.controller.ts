import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { SignupDto } from '../dto/signup.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserService } from '../services/users.service';
import { SafeUser, AuthResponse } from '../dto/user-responses.dto';
import { Public } from '../../utils/decorators/authPublic.decorators';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { AuthorizedGuard } from '../../utils/guard/authorized-role.guard';
import { Roles } from '../../utils/common/Roles.enum';
import { extractClientIp } from '../../utils/http/extract-client-ip.util';

@ApiTags('User Management')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({ type: SignupDto, description: 'User registration details including email, username, and secure password.' })
  @ApiCreatedResponse({ description: 'The user has been successfully created.', type: SafeUser })
  @ApiBadRequestResponse({ description: 'Validation failed (e.g., weak password, username too short, invalid email format).' })
  @ApiConflictResponse({ description: 'Conflict. A user with this email or username already exists.' })
  async register(@Body() body: SignupDto): Promise<SafeUser> {
    return this.userService.signup(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and receive JWT access token' })
  @ApiBody({ type: LoginUserDto, description: 'User login credentials.' })
  @ApiOkResponse({ description: 'User successfully authenticated.', type: AuthResponse })
  @ApiBadRequestResponse({ description: 'Validation failed on the input payload.' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  async login(
    @Body() body: LoginUserDto,
    @Req() req: ExpressRequest,
  ): Promise<AuthResponse> {
    const clientIp = extractClientIp(req);
    return this.userService.signIn(body, clientIp);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get()
  @ApiOperation({ summary: 'Retrieve all users', description: 'Requires an active JWT token and ADMIN role.' })
  @ApiOkResponse({ description: 'Successfully retrieved the list of users.', type: [SafeUser] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. JWT token is missing, expired, or invalid.' })
  @ApiForbiddenResponse({ description: 'Forbidden. The authenticated user does not have ADMIN privileges.' })
  async findAllUsers(): Promise<SafeUser[]> {
    return this.userService.findAllUsers();
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific user by ID', description: 'Requires an active JWT token and ADMIN role.' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique numeric identifier of the user', example: 1 })
  @ApiOkResponse({ description: 'Successfully retrieved the user.', type: SafeUser })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. JWT token is missing, expired, or invalid.' })
  @ApiForbiddenResponse({ description: 'Forbidden. The authenticated user does not have ADMIN privileges.' })
  @ApiNotFoundResponse({ description: 'Not Found. No user exists with the provided ID.' })
  async findUser(@Param('id', ParseIntPipe) id: number): Promise<SafeUser> {
    const user = await this.userService.findUserById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    const { password: _omit, ...safe } = user;
    return safe as SafeUser;
  }
}