import {
  Customer,
  DeliveryMethod,
  PaymentMethod,
  Prisma,
  Product,
} from '@prisma/client';
import { TCreateSeedStateOption } from '../../../src/util/factory';
import { faker } from '@faker-js/faker';

export const orderGenerator = (
  qty: number,
  state: {
    customers: TCreateSeedStateOption;
    products: TCreateSeedStateOption;
  },
) => {
  const orders: Prisma.OrderCreateInput[] = [];
  const quantity = faker.finance.amount(1, 10);
  for (let i = 0; i < qty; ++i) {
    orders.push({
      customer: {
        connect: { id: (state.customers.getRandom() as Customer).id },
      },
      product: { connect: { id: (state.products.getRandom() as Product).id } },
      quantity,
      deliveryMethod: faker.helpers.enumValue(DeliveryMethod),
      paymentMethod: faker.helpers.enumValue(PaymentMethod),
    });
  }

  return orders;
};
