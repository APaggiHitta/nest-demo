import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error: UploadApiErrorResponse | undefined, result) => {
          if (error) {
            reject(new Error(error.message || 'Error al subir la imagen'));
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
