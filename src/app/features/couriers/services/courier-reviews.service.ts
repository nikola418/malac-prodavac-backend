import { Inject, Injectable } from '@nestjs/common';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { CustomPrismaService } from 'nestjs-prisma';
import { CourierReviewEntity } from '../entities';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { CreateCourierReviewDto } from '../dto';
import { Prisma } from '@prisma/client';
import { Cursors, pageAndLimit } from '../../../../util/helper';
import { CouriersService } from './couriers.service';
import { ShopsService } from '../../shops/services';

@Injectable()
export class CourierReviewsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.CourierReviewInclude = {
    courier: { include: CouriersService.include },
    shop: { include: ShopsService.include },
  };

  async create(
    courierId: number,
    dto: CreateCourierReviewDto,
    user: JWTPayloadUser,
  ): Promise<CourierReviewEntity> {
    const review = this.prisma.client.courierReview.create({
      data: {
        courierId,
        shopId: user.shop?.id,
        text: dto.text,
        rating: dto.rating,
      },
    });

    const courier = this.prisma.client.courier.findUniqueOrThrow({
      where: { id: courierId },
    });

    const updatedCourier = this.prisma.client.courier.update({
      where: { id: courierId },
      data: {
        rating: (await courier).rating
          .times((await courier).ratingsCount)
          .add(dto.rating)
          .div((await courier).ratingsCount + 1),
        ratingsCount: { increment: 1 },
      },
    });

    const [res] = await this.prisma.client.$transaction([
      review,
      courier,
      updatedCourier,
    ]);

    return res;
  }

  findAll(
    courierId: number,
    args: Prisma.CourierReviewFindManyArgs,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.courierReview.paginate({
      where: { ...args.where, courierId },
      orderBy: args.orderBy,
      include: args.include ?? CourierReviewsService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({
          ...cursors,
          limit,
          getCursor: (review) => {
            return review.courierId
              .toString()
              .concat(',')
              .concat(review.shopId.toString());
          },
          parseCursor: (cursor) => {
            const [courierId, shopId] = cursor.split(',');
            return {
              courierId_shopId: {
                courierId: Number(courierId),
                shopId: Number(shopId),
              },
            };
          },
        });
  }

  findOne(
    where: Prisma.CourierReviewWhereUniqueInput,
    include?: Prisma.CourierReviewInclude,
  ): Promise<CourierReviewEntity> {
    return this.prisma.client.courierReview.findUniqueOrThrow({
      where,
      include: include ?? CourierReviewsService.include,
    });
  }
}
