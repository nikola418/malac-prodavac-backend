/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.UserInclude = {
    buyer: true,
    deliverer: true,
    seller: true,
  };

  async validateUser(email: string, password: string) {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        email,
      },
      include: UsersService.queryInclude,
    });
  }

  create(createUserDto: CreateUserDto) {
    return `This action returns all users`;
  }

  findAll() {
    return `This action returns all users`;
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
