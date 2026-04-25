import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { extname } from 'path';

type MulterLikeFile = {
  mimetype?: string;
  originalname?: string;
};

const ALLOWED_FILE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const ALLOWED_FILE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.pdf',
]);

const UNSUPPORTED_IMAGE_FORMAT_MESSAGE =
  'Unsupported image format. Use JPG, PNG, WEBP or PDF';

/**
 * Multer file filter that accepts common web image MIME types only.
 */
export const fileFilter = (
  _req: Request,
  file: MulterLikeFile,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const mimeType = file.mimetype?.trim().toLowerCase() || '';

  if (ALLOWED_FILE_MIME_TYPES.has(mimeType)) {
    callback(null, true);
    return;
  }

  const fileExtension = extname(file.originalname || '').toLowerCase();
  const hasAllowedExtension = ALLOWED_FILE_EXTENSIONS.has(fileExtension);
  const hasGenericMimeType =
    !mimeType || mimeType === 'application/octet-stream';

  if (!(hasGenericMimeType && hasAllowedExtension)) {
    return callback(
      new BadRequestException(UNSUPPORTED_IMAGE_FORMAT_MESSAGE),
      false,
    );
  }

  callback(null, true);
};
