import { Courier } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';
import { DecimalToNumber } from '../../../common/decorators';

export class CourierEntity implements Courier {
  constructor(partial: Partial<CourierEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  @DecimalToNumber()
  routeStartLatitude: Decimal;
  @DecimalToNumber()
  routeStartLongitude: Decimal;
  @DecimalToNumber()
  routeEndLatitude: Decimal;
  @DecimalToNumber()
  routeEndLongitude: Decimal;

  updatedAt: Date;
  createdAt: Date;

  @Type(() => UserEntity)
  user?: UserEntity;
}
