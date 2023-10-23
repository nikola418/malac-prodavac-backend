import { UnauthorizedException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';
import { comparePassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.UserInclude = {
    customer: true,
    courier: true,
    shop: true,
  };

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        email,
      },
      include: UsersService.queryInclude,
    });

    if (!comparePassword(password, user.password))
      throw new UnauthorizedException();

    return user;
  }

  findAll(findOptions: Prisma.UserFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<User, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        ...findOptions,
        include: UsersService.queryInclude,
      },
      { page },
    );
  }

  async findOne(where: Prisma.UserWhereInput) {
    return await this.prisma.user.findFirstOrThrow({
      where,
      include: UsersService.queryInclude,
    });
  }
}
