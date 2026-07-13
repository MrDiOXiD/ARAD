import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload as JwtLibPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../../users/services/users.service';
import { UserEntity } from '@/users/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: UserEntity | null;
  }
}

interface JwtInterface extends JwtLibPayload {
  id: string | number; // <-- 1. Allow id to be string OR number
  email: string;
  username: string;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.slice(7); // strip "Bearer "
    if (!token) {
      req.user = null;
      return next();
    }

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      console.error('JWT_SECRET is missing from environment variables!'); // Added helper log
      req.user = null;
      return next();
    }

    try {
      const payload = verify(token, secret) as JwtInterface;

      // 2. FIXED: Allow either 'string' or 'number' types for the ID
      if (!payload?.id || (typeof payload.id !== 'string' && typeof payload.id !== 'number')) {
        req.user = null;
        return next();
      }

      req.user = await this.userService.findUserById(+payload.id);
    } catch (error:any) {
      // Added log to help you debug in terminal if verification fails
      console.error('JWT Verification failed:', error.message); 
      req.user = null;
    }

    return next();
  }
}