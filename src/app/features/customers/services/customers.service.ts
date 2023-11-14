import { Inject, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Prisma, UserRole } from '@prisma/client';
import { Cursors, hashPassword, pageAndLimit } from '../../../../util/helper';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.CustomerInclude = {
    user: true,
  };

  create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.client.customer.create({
      data: {
        user: {
          create: {
            ...createCustomerDto.user,
            password: hashPassword(createCustomerDto.user.password),
            roles: { set: [UserRole.Customer] },
          },
        },
      },
      include: CustomersService.include,
    });
  }

  async findAll(
    args: Prisma.CustomerFindManyArgs,
    user: JWTPayloadUser,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.customer.paginate({
      where: {
        ...args.where,
        orders: user.roles.includes(UserRole.Shop)
          ? {
              some: {
                orderProducts: { some: { product: { shopId: user.shop?.id } } },
              },
            }
          : undefined,
      },
      orderBy: args.orderBy,
      include: args.include ?? CustomersService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.CustomerWhereUniqueInput,
    include?: Prisma.CustomerInclude,
  ) {
    return this.prisma.client.customer.findUniqueOrThrow({
      where,
      include: include ?? CustomersService.include,
    });
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return this.prisma.client.customer.update({
      where: { id },
      data: {
        user: {
          update: {
            ...updateCustomerDto.user,
            password:
              updateCustomerDto.user?.password &&
              hashPassword(updateCustomerDto.user.password),
          },
        },
      },
      include: CustomersService.include,
    });
  }
}
