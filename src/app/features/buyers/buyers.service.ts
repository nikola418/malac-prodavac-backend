/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, UserRole } from '@prisma/client';
import { CreateUserDto } from '../users/dto';
import { hashPassword } from 'src/util/helper';

@Injectable()
export class BuyersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.BuyerInclude = { user: true };

  create(createBuyerDto: CreateBuyerDto) {
    return this.prisma.buyer.create({
      data: {
        user: {
          create: {
            ...(createBuyerDto as CreateUserDto),
            password: hashPassword(createBuyerDto.password),
            role: UserRole.Buyer,
          },
        },
      },
      include: BuyersService.queryInclude,
    });
  }

  findAll() {
    return this.prisma.buyer.findMany({
      where: { user: { role: UserRole.Buyer } },
      include: BuyersService.queryInclude,
    });
  }

  findOne(id: number) {
    return this.prisma.buyer.findFirstOrThrow({
      where: { id, user: { role: UserRole.Buyer } },
      include: BuyersService.queryInclude,
    });
  }

  update(id: number, updateBuyerDto: UpdateBuyerDto) {
    return `This action updates a #${id} buyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} buyer`;
  }
}
