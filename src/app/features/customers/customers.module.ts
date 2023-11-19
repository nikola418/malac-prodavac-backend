import { Module } from '@nestjs/common';
import {
  CustomerOrdersService,
  CustomersService,
  FavoriteProductsService,
  FavoriteShopsService,
  ScheduledPickupsService,
} from './services';
import {
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
    FavoriteProductsController,
    FavoriteShopsController,
    ScheduledPickupsController,
    CustomerOrdersController,
  ],
  providers: [
    CustomersService,
    FavoriteProductsService,
    FavoriteShopsService,
    ScheduledPickupsService,
    CustomerOrdersService,
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
