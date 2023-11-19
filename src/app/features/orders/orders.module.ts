import { Module, forwardRef } from '@nestjs/common';
import { OrdersService, ScheduledPickupsService } from './services';
import { OrdersController, ScheduledPickupsController } from './controllers';
import { CaslModule } from 'nest-casl';
import { permissions } from './orders.permissions';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
    forwardRef(() => ProductsModule),
  ],
  controllers: [OrdersController, ScheduledPickupsController],
  providers: [OrdersService, ScheduledPickupsService],
  exports: [ScheduledPickupsService],
})
export class OrdersModule {}
