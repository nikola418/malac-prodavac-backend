/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { CreateUserDto } from '../users/dto';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { hashPassword } from '../../../util/helper';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.SellerInclude = {
    user: true,
    products: true,
  };

  create(createSellerDto: CreateSellerDto) {
    return this.prisma.seller.create({
      data: {
        user: {
          create: {
            ...(createSellerDto as CreateUserDto),
            password: hashPassword(createSellerDto.password),
            role: UserRole.Seller,
          },
        },
      },
      include: SellersService.queryInclude,
    });
  }

  findAll() {
    return this.prisma.seller.findMany({
      where: { user: { role: UserRole.Seller } },
      include: SellersService.queryInclude,
    });
  }

  findOne(id: number) {
    return this.prisma.seller.findFirstOrThrow({
      where: { id, user: { role: UserRole.Seller } },
      include: SellersService.queryInclude,
    });
  }

  update(id: number, updateSellerDto: UpdateSellerDto) {
    return `This action updates a #${id} seller`;
  }

  remove(id: number) {
    return `This action removes a #${id} seller`;
  }
}
