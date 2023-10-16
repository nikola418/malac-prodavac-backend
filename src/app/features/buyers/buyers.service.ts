/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class BuyersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.UserInclude = { buyer: true };

  create(createBuyerDto: CreateBuyerDto) {
    return this.prisma.user.create({
      data: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: UserRole.Buyer,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { role: UserRole.Buyer },
      include: BuyersService.queryInclude,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} buyer`;
  }

  update(id: number, updateBuyerDto: UpdateBuyerDto) {
    return `This action updates a #${id} buyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} buyer`;
  }
}
