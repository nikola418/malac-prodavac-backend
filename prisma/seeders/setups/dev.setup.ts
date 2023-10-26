import { PrismaClient } from '@prisma/client';
import { createSeedStateFactory } from '../../../src/util/factory';
import { devConfig } from '../configs';
import { categories } from '../data';

type SeedPrivileges = 'categories';

const state = createSeedStateFactory<SeedPrivileges>(devConfig);
const prisma = new PrismaClient();

export const devSetup = async () => {
  console.log('Deleting data', '...');

  if (state.categories.privileges.delete) {
    await prisma.category.deleteMany();
    await prisma.$executeRaw`ALTER SEQUENCE categories_id_seq RESTART WITH 1`;
  }

  console.log('Seeding:');

  if (state.categories.privileges.write) {
    console.log('Categories:');

    for (const category of categories) {
      await prisma.category.create({
        data: {
          name: category.name,
          subCategories: {
            createMany: {
              data: category.categories.map(({ name }) => ({ name })),
              skipDuplicates: true,
            },
          },
        },
      });
    }
  }
};
