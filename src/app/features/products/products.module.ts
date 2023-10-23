import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './products.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
