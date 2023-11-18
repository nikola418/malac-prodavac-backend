import { Global, Module } from '@nestjs/common';
import { NotificationSubjectsService, NotificationsService } from './services';
import { NotificationsController } from './notifications.controller';
import { CaslModule } from 'nest-casl';
import { permissions } from './notifications.permissions';

@Global()
@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [NotificationsController],
  providers: [NotificationSubjectsService, NotificationsService],
  exports: [NotificationSubjectsService],
})
export class NotificationsModule {}
