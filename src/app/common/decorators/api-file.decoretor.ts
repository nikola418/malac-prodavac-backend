import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const ApiFile = (
  fieldName: string,
  required = true,
  localOptions?: MulterOptions,
) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: { [fieldName]: { type: 'file' } },
      },
    }),
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
  );
