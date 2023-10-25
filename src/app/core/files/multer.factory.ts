import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../configuration/app';
import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerFactory = (
  configService: ConfigService,
): MulterModuleOptions => {
  const config = configService.get<AppConfig>('app');

  return {
    dest: config.multerDest,
    limits: { fileSize: config.maxFileSizeB },
  };
};
