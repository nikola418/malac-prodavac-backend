import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './services';
import { OrdersController } from './controllers';
import { CaslModule } from 'nest-casl';
import { permissions } from './orders.permissions';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
    forwardRef(() => ProductsModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
