import { $Enums } from '.prisma/client';
import { Buyer } from '@prisma/client';

export class BuyerEntity implements Buyer {
  constructor(partial: Partial<BuyerEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  paymentMethod: $Enums.PaymentMethod;
  updatedAt: Date;
  createdAt: Date;
}
