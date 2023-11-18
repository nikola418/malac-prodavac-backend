import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomPrismaClientFactory } from 'nestjs-prisma';
import {
  type ExtendedPrismaClient,
  extendedPrismaClient,
  ExtendedPrismaClientKey,
} from './prisma.extension';
import { ConfigType } from '@nestjs/config';
import { PrismaLogs, prismaConfigFactory } from '../configuration/prisma';
import { NotificationSubjectsService } from '../../features/notifications/services/notification-subjects.service';

@Injectable()
export class ExtendedPrismaConfigService
  implements CustomPrismaClientFactory<ExtendedPrismaClient>
{
  constructor(
    @Inject(prismaConfigFactory.KEY)
    private prismaConfig: ConfigType<typeof prismaConfigFactory>,
    private notificationSubjectsService: NotificationSubjectsService,
  ) {}

  private logger = new Logger(ExtendedPrismaClientKey);

  createPrismaClient(): ExtendedPrismaClient {
    return extendedPrismaClient
      .$extends(this.applyLoggingExtension(this.logger, this.prismaConfig.logs))
      .$extends(
        this.applyCourierNotificationExtension(
          this.notificationSubjectsService,
        ),
      );
  }

  applyLoggingExtension(logger: Logger, logLevel: PrismaLogs) {
    return {
      query: {
        async $allOperations({ args, operation, query, model }) {
          const before = Date.now();
          const result = await query(args);
          const after = Date.now();
          const executionTime = after - before;
          logger[logLevel](
            `Prisma Query ${model}.${operation} took ${executionTime}ms`,
          );

          return result;
        },
      },
    };
  }

  applyCourierNotificationExtension(
    notificationsService: NotificationSubjectsService,
  ) {
    return {
      query: {
        courier: {
          async update({ args, query }) {
            const courier = await query(args);
            if (
              args.data.routeStartLatitude ||
              args.data.routeStartLongitude ||
              args.data.routeEndLatitude ||
              args.data.routeEndLongitude
            ) {
              notificationsService.sendCourierInAreaCustomerNotification(
                courier,
              );
              notificationsService.sendCourierInAreaShopNotification(courier);
            }
            return courier;
          },
        },
      },
    };
  }
}
