import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';
import { permissions } from './couriers.permissions';
import { OrdersModule } from '../orders/orders.module';
import { CourierOrdersService, CouriersService } from './services';
import { CouriersController, CourierOrdersController } from './controllers';

@Module({
  imports: [CaslModule.forFeature({ permissions }), OrdersModule],
  controllers: [CouriersController, CourierOrdersController],
  providers: [CouriersService, CourierOrdersService],
})
export class CouriersModule {}
