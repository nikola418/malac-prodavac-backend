import { Inject, Injectable } from '@nestjs/common';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { CustomPrismaService } from 'nestjs-prisma';
import { CreateScheduledPickupDto, UpdateScheduledPickupDto } from '../dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduledPickupsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ScheduledPickupInclude = {};

  create(orderId: number, createScheduledPickupDto: CreateScheduledPickupDto) {
    return this.prisma.client.scheduledPickup.create({
      data: { ...createScheduledPickupDto, orderId },
      include: ScheduledPickupsService.include,
    });
  }

  findOne(
    where: Prisma.ScheduledPickupWhereUniqueInput,
    include?: Prisma.ScheduledPickupInclude,
  ) {
    return this.prisma.client.scheduledPickup.findUniqueOrThrow({
      where,
      include: include ?? ScheduledPickupsService.include,
    });
  }

  update(
    orderId: number,
    scheduledPickupId: number,
    updateScheduledPickupDto: UpdateScheduledPickupDto,
  ) {
    return this.prisma.client.scheduledPickup.update({
      where: { id: scheduledPickupId, orderId },
      data: { ...updateScheduledPickupDto },
      include: ScheduledPickupsService.include,
    });
  }
}
