import { Module } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { BuyersController } from './buyers.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './buyers.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [BuyersController],
  providers: [BuyersService],
})
export class BuyersModule {}
