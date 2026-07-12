// /* eslint-disable prettier/prettier */

// import { Injectable, NestMiddleware } from "@nestjs/common";
// import compression from 'compression';
// import { Request, Response, NextFunction } from "express";

// @Injectable()
// export class CompressionMiddleware implements NestMiddleware {
//   use(req: any, res: any, next: () => void) {
//     compression({
//       level: 6,
//       filter: (req: Request, res: Response) => {
//         if (req.headers["x-no-compression"]) {
//           return false;
//         }
//         return compression.filter(req, res);
//       },
//     })(req, res, next);
//   }
// }
import { Injectable, NestMiddleware } from '@nestjs/common';
import compression from 'compression';
import { Request, Response, NextFunction } from 'express';

// Trusted internal IPs allowed to bypass compression (e.g. health checks)
// Keep empty to disable the bypass entirely for public-facing APIs
const BYPASS_ALLOWED_IPS = new Set<string>([
  '127.0.0.1',
  '::1',
]);

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  // Created once — not per request
  private readonly compress = compression({
    level: 6,
    filter: (req: Request, res: Response): boolean => {
      // Only honour bypass header from trusted internal IPs
      const clientIp = req.ip ?? req.socket?.remoteAddress ?? '';
      const isTrusted = BYPASS_ALLOWED_IPS.has(clientIp);
      if (isTrusted && req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  });

  use(req: Request, res: Response, next: NextFunction): void {
 
    this.compress(req, res, next);
  }
}