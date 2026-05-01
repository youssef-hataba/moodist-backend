import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../src/config/cloudinary';


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'moodist-products',
      format: 'png',
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
    }),
  )
  uploadImage(@UploadedFile() file: any) {
    return {
      url: file.path, // Cloudinary URL
      public_id: file.filename,
    };
  }
}