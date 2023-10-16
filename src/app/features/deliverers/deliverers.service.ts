/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateDelivererDto } from './dto/create-deliverer.dto';
import { UpdateDelivererDto } from './dto/update-deliverer.dto';

@Injectable()
export class DeliverersService {
  create(createDelivererDto: CreateDelivererDto) {
    return 'This action adds a new deliverer';
  }

  findAll() {
    return `This action returns all deliverers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliverer`;
  }

  update(id: number, updateDelivererDto: UpdateDelivererDto) {
    return `This action updates a #${id} deliverer`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliverer`;
  }
}
