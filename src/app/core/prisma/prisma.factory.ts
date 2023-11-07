import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaServiceOptions, loggingMiddleware } from 'nestjs-prisma';
import { PrismaConfig } from '../configuration/prisma/prisma-config.interface';

export const prismaFactory = (config: ConfigService): PrismaServiceOptions => {
  const prismaConfig = config.get<PrismaConfig>('prisma');
  return {
    middlewares: [
      loggingMiddleware({
        logger: new Logger(),
        logLevel: prismaConfig.logs,
      }),
    ],
    explicitConnect: prismaConfig.explicitConnect,
  };
};
