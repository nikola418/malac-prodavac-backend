/* eslint-disable @typescript-eslint/no-unused-vars */
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, User, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto';
import { comparePassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.UserInclude = {
    buyer: true,
    deliverer: true,
    seller: true,
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

  create(createUserDto: CreateUserDto) {
    return `This action returns all users`;
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
