/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { ConfigService } from "@nestjs/config"; // Import ConfigService
import { UserService } from "../../users/services/users.service";
import { UserEntity } from "../../users/entities/user.entity";

declare module "express" {
  interface Request {
    user?: UserEntity | null;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService, private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const secretKey = this.configService.get<string>("JWT_SECRET");
    const authHeaders = req.headers.authorization;

    // ✅ DO NOT send response here
    if (!authHeaders) {
      req.user = null;
      return next(); // 🔥 just continue
    }

    try {
      const token = authHeaders.split(" ")[1];

      //broken code
      // const { id } = verify(token, secretKey) as JwtInterface;
      const secret = this.configService.get<string>("JWT_SECRET");
      if (!secret) throw new InternalServerErrorException("JWT secret not configured");

      let payload: JwtInterface;
      try {
        payload = verify(token, secret) as unknown as JwtInterface;
      } catch {
        req.user = null;
        return next();
      }
      const { id } = payload;
      const currentUser = await this.userService.findUserById(+id);
      req.user = currentUser;

      return next();
    } catch (error) {
      req.user = null;
      console.log(req);

      return next();
    }
  }
}
interface JwtInterface {
  id: string;
}
