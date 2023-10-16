import { Module } from '@nestjs/common';
import { DeliverersService } from './deliverers.service';
import { DeliverersController } from './deliverers.controller';

@Module({
  controllers: [DeliverersController],
  providers: [DeliverersService],
})
export class DeliverersModule {}
