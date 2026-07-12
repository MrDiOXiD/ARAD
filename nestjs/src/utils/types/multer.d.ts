// src/types/multer.d.ts

declare global {
  namespace Express {
    namespace Multer {
      type File = import('multer').File;
    }
  }
}

export {};
