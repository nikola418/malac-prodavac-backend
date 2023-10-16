import { $Enums } from '.prisma/client';
import { User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { DecimalToNumber, ExcludeProperty } from 'src/app/common/decorators';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  firstName: string;
  lastName: string;
  email: string;
  @ExcludeProperty()
  password: string;
  address: string;
  @DecimalToNumber()
  addressLatitude: Decimal;
  @DecimalToNumber()
  addressLongitude: Decimal;
  phoneNumber: string;
  role: $Enums.UserRole;
  profilePicture: string;
  updatedAt: Date;
  createdAt: Date;
}
