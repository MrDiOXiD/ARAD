import { BadRequestException } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: join(process.cwd(), 'uploads', 'images'),
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      // uuid prevents filename collisions and path-traversal via crafted names
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${uuid()}${ext}`);
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Only JPEG, PNG and WebP images are accepted'), false);
    }
  },
};
