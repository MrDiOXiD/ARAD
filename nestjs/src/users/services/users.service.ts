// // /* eslint-disable prettier/prettier */
// // import {
// //   ConflictException,
// //   Injectable,
// // } from '@nestjs/common';
// // import { InjectRepository } from '@nestjs/typeorm';
// // import { UserEntity } from '../entities/user.entity';
// // import { Repository } from 'typeorm';
// // import { hash, compare } from 'bcrypt';
// // import { SignupDto } from '../dto/signup.dto';
// // import { LoginUserDto } from '../dto/login-user.dto';
// // import { JwtPayload } from '../../utils/jwt/jwt-payload';
// // import { JwtService } from '@nestjs/jwt';
// // import { ConfigService } from '@nestjs/config';
// // import { AuditService } from '../../audit/audit.services';
// // import { normalizeError } from '@/utils/errors/normalize-error.util'; // baseUrl = src/

// // @Injectable()
// // export class UserService {
// //   constructor(
// //     @InjectRepository(UserEntity)
// //     private readonly userRepository: Repository<UserEntity>,
// //     private readonly   jwtService:JwtService,
// //     private readonly   configService:ConfigService,
// //     private readonly auditService: AuditService,
// //   ) {}
// //   //Register
// //   async signup(body: SignupDto) {
// //     const user = await this.findUserByEmail(body.email);
// //     if (user) throw new ConflictException('Email Already exists');
// //     body.password = await this.hashPassword(body.password);
// //     const newUser = this.userRepository.create(body);
// //     const saveUser=await this.userRepository.save(newUser)
// //     return saveUser ;
// //   }

// //   //Login
// //   async signIn(body: LoginUserDto,clientIp: string) {
// //     const { email, password } = body;
// //     const user = await this.findUserByEmail(email);
// //     if (!user || !(await this.comparePassword(password, user.password))) {
// //       throw new ConflictException('Invalid email or password');
// //     }
// //     delete user.password;
// //     const payload: JwtPayload = {
// //       username: user.username,
// //       email: user.email,
// //       id: user.id,
// //       role:user.roles
// //     };
// //     const secret = this.configService.get<string>('JWT_SECRET');
// //     const accessToken = this.jwtService.sign(payload, {
// //       secret, 
// //       expiresIn: '1h',
// //     });
// // try {
// //   this.auditService.logUserLogin(user.id, clientIp);
// //   console.log(accessToken);
  
// //   return { accessToken, user };
// // } catch (error) {
// //   this.auditService.failedLogUserLogin(user.id, error,error.stack);
// // }
// //   }
// // //Find Users
// // async findAllUsers(){
// //  return await this.userRepository.find()
// // }
// // async findUserById(id:number): Promise<UserEntity | null> {
// //   return await  this.userRepository.findOne({where:{id}})

// // }
// //   //helpers
// //   async findUserByEmail(email: string) {
// //     return this.userRepository.findOne({ where: { email } });
// //   }
// //   //hash Password
// //   async hashPassword(password: string) {
// //     return await hash(password, 10);
// //   }
// //   async comparePassword(password: string, userPassword: string) {
// //     return await compare(password, userPassword);
// //   }
// // }

// import {
//   ConflictException,
//   Injectable,
//   InternalServerErrorException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { hash, compare } from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';

// import { UserEntity } from '../entities/user.entity';
// import { SignupDto } from '../dto/signup.dto';
// import { LoginUserDto } from '../dto/login-user.dto';
// import { JwtPayload } from '../../utils/jwt/jwt-payload';
// import { AuditService } from '../../audit/audit.services';
// import { normalizeError } from '../../utils/errors/normalize-error.util';

// // What we safely return to the client after login
// interface AuthResponse {
//   accessToken: string;
//   user: {
//     id: number;
//     username: string;
//     email: string;
//   };
// }

// // What we safely return to the client after signup
// type SafeUser = Omit<UserEntity, 'password'>;

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepository: Repository<UserEntity>,
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//     private readonly auditService: AuditService,
//   ) {}

//   // ── Register ────────────────────────────────────────────────────────────────

//   async signup(body: SignupDto): Promise<SafeUser> {
//     const existing = await this.findUserByEmail(body.email);
//     if (existing) throw new ConflictException('Email already in use');

//     const hashed = await this.hashPassword(body.password);
//     const newUser = this.userRepository.create({ ...body, password: hashed });
//     const saved = await this.userRepository.save(newUser);

//     // Destructure password out — never return hash to the client
//     const { password: _omit, ...safeUser } = saved;
//     return safeUser as SafeUser;
//   }

//   // ── Login ────────────────────────────────────────────────────────────────────

//   async signIn(body: LoginUserDto, clientIp: string): Promise<AuthResponse> {
//     const { email, password } = body;

//     const user = await this.findUserByEmail(email);

//     // Single vague message — never reveal whether email or password was wrong
//     const authError = new UnauthorizedException('Invalid credentials');

//     if (!user) throw authError;

//     const passwordMatch = await this.comparePassword(password, user.password);
//     if (!passwordMatch) throw authError;

//     // Guard the secret — crash loudly at startup if misconfigured,
//     // not silently at sign-in time
//     const secret = this.configService.get<string>('JWT_SECRET');
//     if (!secret) {
//       throw new InternalServerErrorException('Auth misconfiguration');
//     }

//     const payload: JwtPayload = {
//       username: user.username,
//       email: user.email,
//       id: user.id,
//       role: user.roles,
//     };

//     let accessToken: string;
//     try {
//       accessToken = this.jwtService.sign(payload, { secret, expiresIn: '1h' });
//     } catch (error) {
//       const err = normalizeError(error);
//       // log internally — never expose JWT errors to the client
//       this.auditService.failedLogUserLogin(user.id, err.message, err.stack);
//       throw new InternalServerErrorException('Could not issue token');
//     }

//     // Audit successful login — outside the token try/catch so
//     // an audit failure doesn't roll back a successful login
//     try {
//       this.auditService.logUserLogin(user.id, clientIp);
//     } catch (error) {
//       // Audit failure must never break the login response
//       const err = normalizeError(error);
//       this.auditService.failedLogUserLogin(user.id, err.message, err.stack);
//     }

//     // Return only the fields the client actually needs
//     return {
//       accessToken,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//       },
//     };
//   }

//   // ── Queries ──────────────────────────────────────────────────────────────────

//   async findAllUsers(): Promise<SafeUser[]> {
//     const users = await this.userRepository.find();
//     // Strip password from every row before returning
//     return users.map(({ password: _omit, ...safe }) => safe as SafeUser);
//   }

//   async findUserById(id: number): Promise<UserEntity | null> {
//     return this.userRepository.findOne({ where: { id } });
//   }

//   // ── Helpers (private) ────────────────────────────────────────────────────────

//   async findUserByEmail(email: string): Promise<UserEntity | null> {
//     return this.userRepository.findOne({ where: { email } });
//   }

//   private async hashPassword(password: string): Promise<string> {
//     return hash(password, 12); // 12 rounds — OWASP minimum for bcrypt
//   }

//   private async comparePassword(
//     plain: string,
//     hashed: string,
//   ): Promise<boolean> {
//     return compare(plain, hashed);
//   }
// }
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from '../entities/user.entity';
import { SignupDto } from '../dto/signup.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtPayload } from '../../utils/jwt/jwt-payload';
import { AuditService } from '../../audit/audit.services';
import { normalizeError } from '../../utils/errors/normalize-error.util';

// What we safely return to the client after login
interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// What we safely return to the client after signup
type SafeUser = Omit<UserEntity, 'password'>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {}

  // ── Register ────────────────────────────────────────────────────────────────

  async signup(body: SignupDto): Promise<SafeUser> {
    const existing = await this.findUserByEmail(body.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await this.hashPassword(body.password);
    const newUser = this.userRepository.create({ ...body, password: hashed });
    const saved = await this.userRepository.save(newUser);

    // Destructure password out — never return hash to the client
    const { password: _omit, ...safeUser } = saved;
    return safeUser as SafeUser;
  }

  // ── Login ────────────────────────────────────────────────────────────────────

  async signIn(body: LoginUserDto, clientIp: string): Promise<AuthResponse> {
    const { email, password } = body;

    const user = await this.findUserByEmail(email);

    // Single vague message — never reveal whether email or password was wrong
    const authError = new UnauthorizedException('Invalid credentials');

    if (!user) throw authError;

    const passwordMatch = await this.comparePassword(password, user.password);
    if (!passwordMatch) throw authError;

    // Guard the secret — crash loudly at startup if misconfigured,
    // not silently at sign-in time
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('Auth misconfiguration');
    }

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
      // log internally — never expose JWT errors to the client
      this.auditService.failedLogUserLogin(user.id, err.message, err.stack);
      throw new InternalServerErrorException('Could not issue token');
    }

    // Audit successful login — outside the token try/catch so
    // an audit failure doesn't roll back a successful login
    try {
      this.auditService.logUserLogin(user.id, clientIp);
    } catch (error) {
      // Audit failure must never break the login response
      const err = normalizeError(error);
      this.auditService.failedLogUserLogin(user.id, err.message, err.stack);
    }

    // Return only the fields the client actually needs
    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  // ── Queries ──────────────────────────────────────────────────────────────────

  async findAllUsers(): Promise<SafeUser[]> {
    const users = await this.userRepository.find();
    // Strip password from every row before returning
    return users.map(({ password: _omit, ...safe }) => safe as SafeUser);
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // ── Helpers (private) ────────────────────────────────────────────────────────

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 12); // 12 rounds — OWASP minimum for bcrypt
  }

  private async comparePassword(
    plain: string,
    hashed: string,
  ): Promise<boolean> {
    return compare(plain, hashed);
  }
}
