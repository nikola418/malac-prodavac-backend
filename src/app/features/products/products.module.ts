import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './products.permissions';
import { ProductMediasController } from './controllers';
import { ProductMediasService } from './services';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerFactory } from '../../core/files';

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) =>
        multerFactory(config, 'productMediaDest'),
      inject: [ConfigService],
    }),
  ],
  controllers: [ProductsController, ProductMediasController],
  providers: [ProductsService, ProductMediasService],
})
export class ProductsModule {}
