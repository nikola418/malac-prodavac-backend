import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';

export const extendedPrismaClient = new PrismaClient().$extends(
  pagination({
    pages: { limit: 20, includePageCount: true },
    cursor: {
      limit: 20,
    },
  }),
);

export const extendedPrismaClientFactory = () => {
  return extendedPrismaClient;
};

export type ExtendedPrismaClient = typeof extendedPrismaClient;
export const ExtendedPrismaClientKey = 'ExtendedPrismaClient';
