import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { CaslModule } from 'nest-casl';
import { multerFactory } from '../../core/files';
import { OrdersModule } from '../orders/orders.module';
import { OrdersService } from '../orders/services';
import {
  ProductMediasController,
  ProductQuestionAnswersController,
  ProductQuestionsController,
  ProductReviewRepliesController,
  ProductReviewsController,
  ProductsController,
} from './controllers';
import { permissions } from './products.permissions';
import {
  ProductMediasService,
  ProductQuestionAnswersService,
  ProductQuestionsService,
  ProductReviewRepliesService,
  ProductReviewsService,
  ProductsService,
} from './services';

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) =>
        multerFactory(config, 'productMediaDest'),
      inject: [ConfigService],
    }),
    forwardRef(() => OrdersModule),
  ],
  controllers: [
    ProductsController,
    ProductMediasController,
    ProductReviewsController,
    ProductReviewRepliesController,
    ProductQuestionsController,
    ProductQuestionAnswersController,
  ],
  providers: [
    OrdersService,
    ProductsService,
    ProductMediasService,
    ProductReviewsService,
    ProductReviewRepliesService,
    ProductQuestionsService,
    ProductQuestionAnswersService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
