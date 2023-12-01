import { Module } from '@nestjs/common';
import { ApkService } from './apk.service';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ApkController } from './apk.controller';
import { AppConfig } from '../../core/configuration/app';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => {
        const appCohfig = config.get<AppConfig>('app');

        return {
          storage: diskStorage({
            destination: `${appCohfig.multerDest}/${appCohfig.apkDest}`,
            filename: (req, file, cb) => {
              cb(null, 'malac-prodavac.apk');
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [ApkController],
  providers: [ApkService],
})
export class ApkModule {}
