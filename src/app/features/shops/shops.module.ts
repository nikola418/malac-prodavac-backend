import { Module } from '@nestjs/common';
import {
  ScheduledPickupsService,
  ShopOrdersService,
  ShopsService,
} from './services';
import {
  ScheduledPickupsController,
  ShopOrdersController,
  ShopsController,
} from './controllers';
import { CaslModule } from 'nest-casl';
import { permissions } from './shops.permissions';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [CaslModule.forFeature({ permissions }), OrdersModule],
  controllers: [
    ShopsController,
    ScheduledPickupsController,
    ShopOrdersController,
  ],
  providers: [ShopsService, ScheduledPickupsService, ShopOrdersService],
  exports: [ShopsService],
})
export class ShopsModule {}
