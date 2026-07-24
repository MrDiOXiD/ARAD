import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { SignupDto } from '../dto/signup.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtPayload } from '../../utils/jwt/jwt-payload';
import { AuditService } from '../../audit/audit.services';
import { normalizeError } from '../../utils/errors/normalize-error.util';
import { UserEntity } from '../entities/user.entity';
// Import the Swagger DTO classes (this replaces the old local type)
import { SafeUser, AuthResponse } from '../dto/user-responses.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {}

  // ── Register ──────────────────────────────────────────────────────────────

  async signup(body: SignupDto): Promise<SafeUser> {
    const existing = await this.findUserByEmail(body.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await this.hashPassword(body.password);
    const newUser = this.userRepository.create({ ...body, password: hashed });
    const saved = await this.userRepository.save(newUser);

    // Return explicit shape matching the SafeUser class
    return {
      id: saved.id,
      email: saved.email,
      username: saved.username,
      roles: saved.roles,
      createdAt: saved.createdAt,
    };
  }

  // ── Login ─────────────────────────────────────────────────────────────────

  async signIn(body: LoginUserDto, clientIp: string): Promise<AuthResponse> {
    const { email, password } = body;
    const user = await this.findUserByEmail(email);

    // Single vague message — never reveal whether email or password was wrong
    const authError = new UnauthorizedException('Invalid credentials');
    if (!user) throw authError;
    if (!(await this.comparePassword(password, user.password))) throw authError;

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) throw new InternalServerErrorException('Auth misconfiguration');

    const payload: JwtPayload = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.roles,
    };

    let accessToken: string;
    try {
      accessToken = this.jwtService.sign(payload, { secret, expiresIn: '1h' });
    } catch (error) {
      const err = normalizeError(error);
      this.auditService.failedLogUserLogin(user.id, err.message, err.stack);
      throw new InternalServerErrorException('Could not issue token');
    }

    // Audit in a separate try — failure must never break a successful login
    try {
      this.auditService.logUserLogin(user.id, clientIp);
    } catch (error) {
      const err = normalizeError(error);
      this.auditService.failedLogUserLogin(user.id, err.message, err.stack);
    }

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        createdAt: user.createdAt,
      },
    };
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  async findAllUsers(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();
    
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
      createdAt: user.createdAt,
    }));
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // ── Helpers (private) ─────────────────────────────────────────────────────

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 12); // 12 rounds — OWASP minimum for bcrypt
  }

  private async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}