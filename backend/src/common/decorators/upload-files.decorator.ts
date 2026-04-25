// upload-files.decorator.ts
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';

export function UploadFiles(
  fieldName: string = 'files',
  maxCount: number = 10,
  options: Partial<MulterOptions> = {},
) {
  const uploadDir = join(process.cwd(), 'uploads');
  mkdirSync(uploadDir, { recursive: true });

  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, maxCount, {
        storage: diskStorage({
          destination: uploadDir,
          filename: (_req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = extname(file.originalname);
            cb(null, `${uniqueSuffix}${ext}`); // e.g. 1745123456789-123456789.pdf
          },
        }),
        ...options,
      }),
    ),
  );
}
