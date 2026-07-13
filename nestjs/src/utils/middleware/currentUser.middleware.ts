import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload as JwtLibPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../../users/services/users.service';
import { UserEntity } from '@/users/entities/user.entity';

// Augment Express Request once — not inline in the middleware file
declare module 'express' {
  interface Request {
    user?: UserEntity | null;
  }
}

interface JwtInterface extends JwtLibPayload {
  id: string;
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
      // Misconfigured server — fail closed, do not proceed
      req.user = null;
      return next();
    }

    try {
      const payload = verify(token, secret) as JwtInterface;

      // Validate the payload has the fields we expect before DB lookup
      if (!payload?.id || typeof payload.id !== 'string') {
        req.user = null;
        return next();
      }

      req.user = await this.userService.findUserById(+payload.id);
    } catch {
      // Expired, tampered, or invalid token — treat as unauthenticated
      req.user = null;
    }

    return next();
  }
}
