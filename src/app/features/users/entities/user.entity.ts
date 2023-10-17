import { $Enums } from '.prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Type } from 'class-transformer';
import { DecimalToNumber } from 'src/app/common/decorators';
import { BuyerEntity } from '../../buyers/entities';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  firstName: string;
  lastName: string;
  email: string;
  @ApiHideProperty()
  @Exclude()
  password: string;
  address: string;
  @DecimalToNumber()
  addressLatitude: Decimal;
  @DecimalToNumber()
  addressLongitude: Decimal;
  phoneNumber: string;
  @ApiProperty({ enum: $Enums.UserRole })
  role: $Enums.UserRole;
  profilePictureKey: string;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => BuyerEntity)
  buyer?: BuyerEntity;
}
