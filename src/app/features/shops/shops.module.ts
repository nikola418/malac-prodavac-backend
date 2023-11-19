import { Module } from '@nestjs/common';
import { ScheduledPickupsService, ShopsService } from './services';
import { ScheduledPickupsController, ShopsController } from './controllers';
import { CaslModule } from 'nest-casl';
import { permissions } from './shops.permissions';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [CaslModule.forFeature({ permissions }), OrdersModule],
  controllers: [ShopsController, ScheduledPickupsController],
  providers: [ShopsService, ScheduledPickupsService],
  exports: [ShopsService],
})
export class ShopsModule {}
