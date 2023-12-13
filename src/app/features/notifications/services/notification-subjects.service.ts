import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { PrismaService } from 'nestjs-prisma';
import { CourierEntity } from '../../couriers/entities';
import {
  distanceToLatitude,
  distanceToLongitude,
} from '../../../common/constants';
import { NotificationsService } from './notifications.service';
import { ProductEntity } from '../../products/entities';
import { ShopEntity } from '../../shops/entities';
import { ScheduledPickupEntity } from '../../orders/entities';

@Injectable()
export class NotificationSubjectsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}
  private logger = new Logger(NotificationSubjectsService.name);

  private readonly subjects: Map<number, Subject<MessageEvent>> = new Map();

  subscribe(user: JWTPayloadUser): Observable<MessageEvent> {
    this.subjects.set(user.id, new Subject<MessageEvent>());
    const subject = this.subjects.get(user.id);
    return subject.asObservable();
  }

  async sendCourierInAreaCustomerNotification(courier: CourierEntity) {
    const customers = await this.prisma.customer.findMany({
      where: {
        user: {
          addressLatitude: {
            lte: courier.routeEndLatitude.add(distanceToLatitude['2.5km']),
            gte: courier.routeEndLatitude.sub(distanceToLatitude['2.5km']),
          },
          addressLongitude: {
            lte: courier.routeEndLongitude.add(distanceToLatitude['2.5km']),
            gte: courier.routeEndLongitude.sub(distanceToLatitude['2.5km']),
          },
        },
        favoriteShops: {
          some: {
            shop: {
              user: {
                addressLatitude: {
                  lte: courier.routeStartLatitude.add(
                    distanceToLatitude['2.5km'],
                  ),
                  gte: courier.routeStartLatitude.sub(
                    distanceToLatitude['2.5km'],
                  ),
                },
                addressLongitude: {
                  lte: courier.routeStartLongitude.add(
                    distanceToLongitude['2.5km'],
                  ),
                  gte: courier.routeStartLongitude.sub(
                    distanceToLongitude['2.5km'],
                  ),
                },
              },
            },
          },
        },
      },
      select: {
        userId: true,
        favoriteShops: {
          select: { shop: true },
          where: {
            shop: {
              user: {
                addressLatitude: {
                  lte: courier.routeStartLatitude.add(
                    distanceToLatitude['2.5km'],
                  ),
                  gte: courier.routeStartLatitude.sub(
                    distanceToLatitude['2.5km'],
                  ),
                },
                addressLongitude: {
                  lte: courier.routeStartLongitude.add(
                    distanceToLongitude['2.5km'],
                  ),
                  gte: courier.routeStartLongitude.sub(
                    distanceToLongitude['2.5km'],
                  ),
                },
              },
            },
          },
        },
      },
    });
    for await (const customer of customers) {
      const notification = <MessageEvent>{
        type: 'courier_in_area_customer',
        retry: 3,
        data: {
          title: `${courier.user?.firstName} ${courier.user?.lastName} je u blizini vaših omiljenih prodavaca!`,
          shops: customer.favoriteShops.map(
            (favShop) => favShop.shop.businessName,
          ),
        },
      };
      const { id } = await this.notificationsService.create(
        customer.userId,
        notification,
      );
      const subject = this.subjects.get(customer.userId);
      subject?.next({ ...notification, id: String(id) });
      this.logger.log('Courier is in the area customer notification created!');
    }
  }

  async sendCourierInAreaShopNotification(courier: CourierEntity) {
    const shops = await this.prisma.shop.findMany({
      where: {
        user: {
          addressLatitude: {
            lte: courier.routeStartLatitude.add(distanceToLatitude['2.5km']),
            gte: courier.routeStartLatitude.sub(distanceToLatitude['2.5km']),
          },
          addressLongitude: {
            lte: courier.routeStartLongitude.add(distanceToLatitude['2.5km']),
            gte: courier.routeStartLongitude.sub(distanceToLatitude['2.5km']),
          },
        },
      },
      select: {
        userId: true,
      },
    });

    for await (const shop of shops) {
      const notification = <MessageEvent>{
        type: 'courier_in_area_shop',
        retry: 3,
        data: {
          title: `${courier.user?.firstName} ${courier.user?.lastName} je u vašoj blizini!`,
        },
      };
      const { id } = await this.notificationsService.create(
        shop.userId,
        notification,
      );
      const subject = this.subjects.get(shop.userId);
      subject?.next({ ...notification, id: String(id) });
      this.logger.log('Courier is in the area shop notification created!');
    }
  }

  async sendNewProductFromFavoriteShopNotification(product: ProductEntity) {
    const customers = await this.prisma.customer.findMany({
      where: { favoriteShops: { some: { shopId: product.shopId } } },
    });
    const shop = await this.prisma.shop.findUnique({
      where: { id: product.shopId },
    });

    for await (const customer of customers) {
      const notification = <MessageEvent>{
        type: 'new_product_favorite_shop',
        retry: 3,
        data: {
          title: `${shop.businessName} je u oglasio novi proizvod!`,
          product: product.title,
        },
      };
      const { id } = await this.notificationsService.create(
        customer.userId,
        notification,
      );
      const subject = this.subjects.get(customer.userId);
      subject?.next({ ...notification, id: String(id) });
      this.logger.log('New product from your favorite shop notification sent!');
    }
  }

  async sendAvailableAtNewLocationNotification(shop: ShopEntity) {
    const customers = await this.prisma.customer.findMany({
      where: {
        user: {
          addressLatitude: {
            lte: shop.availableAtLatitude.add(distanceToLatitude['2.5km']),
            gte: shop.availableAtLatitude.sub(distanceToLatitude['2.5km']),
          },
          addressLongitude: {
            lte: shop.availableAtLongitude.add(distanceToLatitude['2.5km']),
            gte: shop.availableAtLongitude.sub(distanceToLatitude['2.5km']),
          },
        },
      },
    });

    for await (const customer of customers) {
      const notification = <MessageEvent>{
        type: 'products_at_new_location',
        retry: 3,
        data: {
          title: `Proizvodi ${shop.businessName} su od sada dostupni na novoj lokaciji!`,
          location: shop.availableAt,
        },
      };
      const { id } = await this.notificationsService.create(
        customer.userId,
        notification,
      );
      const subject = this.subjects.get(customer.userId);
      subject?.next({ ...notification, id: String(id) });
      this.logger.log('Available at new location notification sent!');
    }
  }

  async sendScheduledPickupNotification(
    scheduledPickup: ScheduledPickupEntity,
  ) {
    const shops = await this.prisma.shop.findMany({
      where: {
        products: {
          some: {
            orders: { some: { scheduledPickup: { id: scheduledPickup.id } } },
          },
        },
      },
    });

    for await (const shop of shops) {
      const notification = <MessageEvent>{
        type: 'scheduled_pickup',
        retry: 3,
        data: {
          title: `Zakazan je termin ličnog preuzimanja za porudžbinu broj: ${scheduledPickup.orderId}. ${scheduledPickup.date} u ${scheduledPickup.timeOfDay}!`,
        },
      };
      const { id } = await this.notificationsService.create(
        shop.userId,
        notification,
      );
      const subject = this.subjects.get(shop.userId);
      subject?.next({ ...notification, id: String(id) });
      this.logger.log('Scheduled pickup notification sent!');
    }
  }
}
