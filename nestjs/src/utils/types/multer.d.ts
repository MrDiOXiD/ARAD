// src/types/multer.d.ts   ← create this file
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: Multer.File[] | Record<string, Multer.File[]>;
    }
    // This is what resolves Express.Multer.File everywhere
    namespace Multer {
      type File = import('multer').File;
    }
  }
}