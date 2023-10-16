import { $Enums, Deliverer } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { DecimalToNumber } from 'src/app/common/decorators';

export class DelivererEntity implements Deliverer {
  constructor(partial: Partial<DelivererEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  @DecimalToNumber()
  pricePerKilometer: Decimal;
  currency: $Enums.Currency;
  updatedAt: Date;
  createdAt: Date;
}
