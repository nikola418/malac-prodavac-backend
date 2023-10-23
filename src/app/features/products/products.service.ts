/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.ProductInclude = {
    category: true,
    discounts: true,
    owner: true,
    reviews: true,
  };

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(
    where: Prisma.ProductWhereUniqueInput,
    include?: Prisma.ProductInclude,
  ) {
    return this.prisma.product.findUniqueOrThrow({
      where,
      include: include ?? ProductsService.include,
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
