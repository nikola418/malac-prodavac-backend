import { Module } from '@nestjs/common';
import {
  CustomersService,
  FavoriteProductsService,
  FavoriteShopsService,
  ScheduledPickupsService,
} from './services';
import {
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
  ],
  providers: [
    CustomersService,
    FavoriteProductsService,
    FavoriteShopsService,
    ScheduledPickupsService,
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
