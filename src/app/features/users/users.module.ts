import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CaslModule } from 'nest-casl';
import { permissions } from './users.permissions';
import { UsersController } from './users.controller';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
