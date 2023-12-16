import { Module } from '@nestjs/common';
import {
  CustomerOrdersService,
  CustomerReviewsService,
  CustomersService,
  FavoriteProductsService,
  FavoriteShopsService,
  ScheduledPickupsService,
} from './services';
import {
  CustomerReviewsController,
  CustomerOrdersController,
  CustomersController,
  FavoriteProductsController,
  FavoriteShopsController,
  ScheduledPickupsController,
} from './controllers';
import { CaslModule } from 'nest-casl';
import { permissions } from './customers.permissions';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [CaslModule.forFeature({ permissions }), OrdersModule],
  controllers: [
    CustomersController,
    CustomerReviewsController,
    FavoriteProductsController,
    FavoriteShopsController,
    ScheduledPickupsController,
    CustomerOrdersController,
  ],
  providers: [
    CustomerReviewsService,
    CustomersService,
    FavoriteProductsService,
    FavoriteShopsService,
    ScheduledPickupsService,
    CustomerOrdersService,
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
