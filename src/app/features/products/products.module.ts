import { Module } from '@nestjs/common';
import {
  ProductReviewRepliesController,
  ProductsController,
  ProductMediasController,
  ProductReviewsController,
} from './controllers';
import { CaslModule } from 'nest-casl';
import { permissions } from './products.permissions';
import {
  ProductMediasService,
  ProductReviewRepliesService,
  ProductReviewsService,
  ProductsService,
} from './services';
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
  controllers: [
    ProductsController,
    ProductMediasController,
    ProductReviewsController,
    ProductReviewRepliesController,
  ],
  providers: [
    ProductsService,
    ProductMediasService,
    ProductReviewsService,
    ProductReviewRepliesService,
  ],
})
export class ProductsModule {}
