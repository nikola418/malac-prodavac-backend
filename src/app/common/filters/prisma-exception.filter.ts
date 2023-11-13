import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { prismaKnownClientExceptionMappings } from '../../../util/definition';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends PrismaClientExceptionFilter {
  constructor({ httpAdapter }: HttpAdapterHost) {
    super(httpAdapter, prismaKnownClientExceptionMappings);
  }

  private logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    this.logger.log(exception);

    super.catch(exception, host);
  }
}

export const PrismaExceptionFilterKey = 'PRISMA_FILTER';
