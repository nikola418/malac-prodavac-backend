import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './sellers.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}
