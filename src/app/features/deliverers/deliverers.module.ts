import { Module } from '@nestjs/common';
import { DeliverersService } from './deliverers.service';
import { DeliverersController } from './deliverers.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './deliverers.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [DeliverersController],
  providers: [DeliverersService],
})
export class DeliverersModule {}
