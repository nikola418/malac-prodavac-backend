import {
  PrismaClient,
  ProductMeasurementUnit,
  Shop,
  UserRole,
  Workday,
} from '@prisma/client';
import { createSeedStateFactory } from '../../../src/util/factory';
import { hashPassword } from '../../../src/util/helper';
import { prodConfig } from '../configs';
import { categoriesV2, couriers, customers, products, shops } from '../data';

type SeedPrivileges =
  | 'categories'
  | 'customers'
  | 'couriers'
  | 'shops'
  | 'products';

const state = createSeedStateFactory<SeedPrivileges>(prodConfig);
const prisma = new PrismaClient();

export const prodSetup = async () => {
  console.log('Seeding:');

  if (state.categories.privileges.write) {
    console.log('Categories...');

    for (const { name, categories: subs } of categoriesV2) {
      const cat = await prisma.category.upsert({
        create: { name },
        update: {},
        where: { name },
      });

      if (subs) {
        for (const { name } of subs) {
          await prisma.category.upsert({
            create: { name, parentCategoryId: cat.id },
            update: { parentCategoryId: cat.id },
            where: { name },
          });
        }
      }
    }
    state.categories.set(
      await prisma.category.findMany({
        where: { parentCategoryId: { not: null } },
      }),
    );
  }

  if (state.customers.privileges.write) {
    console.log('Customers...');

    for (const customer of customers) {
      await prisma.user.upsert({
        create: {
          ...customer.user,
          password: hashPassword(customer.user.password),
          roles: { set: [UserRole.Customer] },
          customer: { create: {} },
        },
        update: {
          ...customer.user,
          password: hashPassword(customer.user.password),
          roles: { set: [UserRole.Customer] },
        },
        where: { email: customer.user.email },
      });
    }
  }

  if (state.couriers.privileges.write) {
    console.log('Couriers...');

    for (const courier of couriers) {
      await prisma.user.upsert({
        create: {
          ...courier.user,
          password: hashPassword(courier.user.password),
          roles: { set: [UserRole.Courier, UserRole.Customer] },
          courier: {
            create: {
              routeStartLatitude: courier.routeStartLatitude,
              routeStartLongitude: courier.routeStartLongitude,
              routeEndLatitude: courier.routeEndLatitude,
              routeEndLongitude: courier.routeEndLongitude,
            },
          },
        },
        update: {
          ...courier.user,
          password: hashPassword(courier.user.password),
          roles: { set: [UserRole.Courier, UserRole.Customer] },
        },
        where: { email: courier.user.email },
      });
    }
  }

  if (state.shops.privileges.write) {
    console.log('Shops...');

    for (const shop of shops) {
      await prisma.user.upsert({
        create: {
          ...shop.user,
          password: hashPassword(shop.user.password),
          roles: { set: [UserRole.Shop, UserRole.Courier, UserRole.Customer] },
          courier: {
            create: {
              routeStartLatitude: shop.courier.routeStartLatitude,
              routeStartLongitude: shop.courier.routeStartLongitude,
              routeEndLatitude: shop.courier.routeEndLatitude,
              routeEndLongitude: shop.courier.routeEndLongitude,
            },
          },
          shop: {
            create: {
              businessName: shop.businessName,
              availableAt: shop.availableAt,
              availableAtLatitude: shop.availableAtLatitude,
              availableAtLongitude: shop.availableAtLongitude,
              openFrom: shop.openFrom,
              openTill: shop.openTill,
              openFromDays: Workday[shop.openFromDays],
              openTillDays: Workday[shop.openTillDays],
            },
          },
        },
        update: {
          ...shop.user,
          password: hashPassword(shop.user.password),
          roles: { set: [UserRole.Shop, UserRole.Courier, UserRole.Customer] },
        },
        where: { email: shop.user.email },
      });
    }

    state.shops.set(await prisma.shop.findMany());
  }

  if (state.products.privileges.write) {
    console.log('Products...');
    for (const category of products) {
      for (const product of category.products) {
        await prisma.product.create({
          data: {
            title: product.title,
            desc: product.desc,
            price: product.price,
            unitOfMeasurement:
              ProductMeasurementUnit[product.unitOfMeasurement],
            availableAt: product.availableAt,
            availableAtLatitude: product.availableAtLatitude,
            availableAtLongitude: product.availableAtLongitude,
            availableFromHours: product.availableFromHours,
            availableTillHours: product.availableTillHours,
            shop: { connect: { id: (state.shops.getRandom() as Shop).id } },
            category: { connect: { name: category.categoryName } },
          },
        });
      }
    }
  }
};
