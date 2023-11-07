import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomPrismaClientFactory } from 'nestjs-prisma';
import {
  type ExtendedPrismaClient,
  extendedPrismaClient,
  ExtendedPrismaClientKey,
} from './prisma.extension';
import { ConfigType } from '@nestjs/config';
import { PrismaLogs, prismaConfigFactory } from '../configuration/prisma';

@Injectable()
export class ExtendedPrismaConfigService
  implements CustomPrismaClientFactory<ExtendedPrismaClient>
{
  constructor(
    @Inject(prismaConfigFactory.KEY)
    private prismaConfig: ConfigType<typeof prismaConfigFactory>,
  ) {}

  private logger = new Logger(ExtendedPrismaClientKey);

  createPrismaClient(): ExtendedPrismaClient {
    return extendedPrismaClient.$extends(
      loggingExtension(this.logger, this.prismaConfig.logs),
    );
  }
}

const loggingExtension = (logger: Logger, logs: PrismaLogs) => {
  return {
    query: {
      async $allOperations({ args, operation, query, model }) {
        const before = Date.now();
        const result = await query(args);
        const after = Date.now();
        const executionTime = after - before;
        logger[logs](
          `Prisma Query ${model}.${operation} took ${executionTime}ms`,
        );

        return result;
      },
    },
  };
};
