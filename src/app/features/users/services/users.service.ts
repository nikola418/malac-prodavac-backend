import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma, UserRole } from '@prisma/client';
import {
  Cursors,
  comparePassword,
  pageAndLimit,
} from '../../../../util/helper';
import { AuthService } from '../../auth/auth.service';
import { Response } from 'express';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';

@Injectable()
export class UsersService {
  constructor(
    private authService: AuthService,
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.UserInclude = {
    customer: true,
    courier: true,
    shop: true,
    profilePicture: true,
  };

  async validateUser(email: string, password: string) {
    const user = await this.prisma.client.user.findFirstOrThrow({
      where: {
        email,
      },
      include: UsersService.include,
    });

    if (!comparePassword(password, user.password))
      throw new UnauthorizedException();

    return user;
  }

  findAll(
    args: Prisma.UserFindManyArgs,
    user: JWTPayloadUser,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.user.paginate({
      where: {
        ...args.where,
        OR: [
          {
            roles: { hasSome: [UserRole.Customer] },
            customer: user.roles.includes(UserRole.Shop)
              ? {
                  orders: {
                    some: {
                      orderProducts: {
                        some: { product: { shopId: user.shop?.id } },
                      },
                    },
                  },
                }
              : undefined,
          },
          { roles: { hasSome: [UserRole.Courier, UserRole.Shop] } },
        ],
      },
      orderBy: args.orderBy,
      include: args.include ?? UsersService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({
          ...cursors,
          limit,
        });
  }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude,
  ) {
    return await this.prisma.client.user.findUniqueOrThrow({
      where,
      include: include ?? UsersService.include,
    });
  }

  async findFirst(where: Prisma.UserWhereInput, include?: Prisma.UserInclude) {
    return await this.prisma.client.user.findFirstOrThrow({
      where,
      include: include ?? UsersService.include,
    });
  }

  async remove(id: number, res: Response) {
    const user = await this.prisma.client.user.delete({
      where: { id },
      include: UsersService.include,
    });

    this.authService.logout(res);

    return user;
  }
}
