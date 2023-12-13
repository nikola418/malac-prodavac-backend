import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomPrismaClientFactory } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
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
      )
      .$extends(
        this.applyNewProductNotificationExtension(
          this.notificationSubjectsService,
        ),
      )
      .$extends(
        this.applyAvailableAtNewLocationExtension(
          this.notificationSubjectsService,
        ),
      )
      .$extends(
        this.applyScheduledPickupNotificationExtension(
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

  applyNewProductNotificationExtension(
    notificationsService: NotificationSubjectsService,
  ) {
    return {
      query: {
        product: {
          async create({ args, query }) {
            const product = await query(args);
            notificationsService.sendNewProductFromFavoriteShopNotification(
              product,
            );
            return product;
          },
        },
      },
    };
  }

  applyAvailableAtNewLocationExtension(
    notificationsService: NotificationSubjectsService,
  ) {
    return {
      query: {
        shop: {
          async update({ args, query }) {
            const shop = await query(args);
            if (
              args.data.availableAt ||
              args.data.availableAtLatitude ||
              args.data.availableAtLongitude
            )
              notificationsService.sendAvailableAtNewLocationNotification(shop);
            return shop;
          },
        },
      },
    };
  }

  applyScheduledPickupNotificationExtension(
    notificationsService: NotificationSubjectsService,
  ) {
    return {
      query: {
        scheduledPickup: {
          async create({ args, query }) {
            const scheduledPickup = await query(args);

            notificationsService.sendScheduledPickupNotification(
              scheduledPickup,
            );
            return scheduledPickup;
          },
        },
      },
    };
  }
}
