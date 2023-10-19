/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateDelivererDto } from './dto/create-deliverer.dto';
import { UpdateDelivererDto } from './dto/update-deliverer.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, UserRole } from '@prisma/client';
import { CreateUserDto } from '../users/dto';
import { hashPassword } from '../../../util/helper';

@Injectable()
export class DeliverersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.DelivererInclude = { user: true };

  create(createDelivererDto: CreateDelivererDto) {
    return this.prisma.deliverer.create({
      data: {
        user: {
          create: {
            ...(createDelivererDto as CreateUserDto),
            password: hashPassword(createDelivererDto.password),
            role: UserRole.Deliverer,
          },
        },
      },
      include: DeliverersService.queryInclude,
    });
  }

  findAll() {
    return this.prisma.deliverer.findMany({
      where: { user: { role: UserRole.Deliverer } },
      include: DeliverersService.queryInclude,
    });
  }

  findOne(id: number) {
    return this.prisma.deliverer.findFirstOrThrow({
      where: { id, user: { role: UserRole.Deliverer } },
      include: DeliverersService.queryInclude,
    });
  }

  update(id: number, updateDelivererDto: UpdateDelivererDto) {
    return `This action updates a #${id} deliverer`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliverer`;
  }
}
