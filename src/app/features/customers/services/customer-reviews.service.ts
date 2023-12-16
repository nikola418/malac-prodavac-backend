import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Injectable, Inject } from '@nestjs/common';
import { CreateCustomerReviewDto } from '../dto/create-customer-review.dto';
import { Prisma } from '@prisma/client';
import { CustomersService } from './customers.service';
import { ShopsService } from '../../shops/services';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class CustomerReviewsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.CustomerReviewInclude = {
    customer: { include: CustomersService.include },
    shop: { include: ShopsService.include },
  };

  async create(
    customerId: number,
    dto: CreateCustomerReviewDto,
    user: JWTPayloadUser,
  ) {
    const review = this.prisma.client.customerReview.create({
      data: {
        customerId,
        shopId: user.shop?.id,
        text: dto.text,
        rating: dto.rating,
      },
    });

    const customer = this.prisma.client.customer.findUniqueOrThrow({
      where: { id: customerId },
    });

    const updatedCustomer = this.prisma.client.customer.update({
      where: { id: customerId },
      data: {
        rating: (await customer).rating
          .times((await customer).ratingsCount)
          .add(dto.rating)
          .div((await customer).ratingsCount + 1),
        ratingsCount: { increment: 1 },
      },
    });

    const [res] = await this.prisma.client.$transaction([
      review,
      customer,
      updatedCustomer,
    ]);

    return res;
  }

  findAll(
    customerId: number,
    args: Prisma.CustomerReviewFindFirstArgs,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.customerReview.paginate({
      where: { ...args.where, customerId },
      orderBy: args.orderBy,
      include: args.include ?? CustomerReviewsService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({
          ...cursors,
          limit,
          getCursor: (review) => {
            return review.customerId
              .toString()
              .concat(',')
              .concat(review.shopId.toString());
          },
          parseCursor: (cursor) => {
            const [customerId, shopId] = cursor.split(',');
            return {
              customerId_shopId: {
                customerId: Number(customerId),
                shopId: Number(shopId),
              },
            };
          },
        });
  }

  findOne(
    where: Prisma.CustomerReviewWhereUniqueInput,
    include?: Prisma.CustomerReviewInclude,
  ) {
    return this.prisma.client.customerReview.findUniqueOrThrow({
      where,
      include: include ?? CustomerReviewsService.include,
    });
  }
}
