import { Module } from '@nestjs/common';
import {
  CustomersService,
  FavoriteProductsService,
  FavoriteShopsService,
} from './services';
import {
  CustomersController,
  FavoriteProductsController,
  FavoriteShopsController,
} from './controllers';
import { CaslModule } from 'nest-casl';
import { permissions } from './customers.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [
    CustomersController,
    FavoriteProductsController,
    FavoriteShopsController,
  ],
  providers: [CustomersService, FavoriteProductsService, FavoriteShopsService],
  exports: [CustomersService],
})
export class CustomersModule {}
