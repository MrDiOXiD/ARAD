import { BadRequestException } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    // absolute path — safe in both dev and prod
    destination: join(process.cwd(), 'uploads', 'images'),
    filename: (_req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) => {
      // uuid prevents filename collisions and path-traversal via crafted names
      const safeName = `${uuid()}${extname(file.originalname).toLowerCase()}`;
      cb(null, safeName);
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1, // reject multi-file abuse on single-upload endpoints
  },
  fileFilter: (
    _req,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      // BadRequestException is caught by NestJS and returns a clean 400
      // — internal mime-type details are NOT leaked to the client
      cb(new BadRequestException('Only JPEG, PNG and WebP images are accepted'), false);
    }
  },
};