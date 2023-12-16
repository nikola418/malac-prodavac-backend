import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';
import { permissions } from './couriers.permissions';
import { OrdersModule } from '../orders/orders.module';
import { CourierOrdersService, CouriersService } from './services';
import {
  CouriersController,
  CourierOrdersController,
  CourierReviewsController,
} from './controllers';
import { CourierReviewsService } from './services/courier-reviews.service';

@Module({
  imports: [CaslModule.forFeature({ permissions }), OrdersModule],
  controllers: [
    CouriersController,
    CourierOrdersController,
    CourierReviewsController,
  ],
  providers: [CouriersService, CourierOrdersService, CourierReviewsService],
})
export class CouriersModule {}
