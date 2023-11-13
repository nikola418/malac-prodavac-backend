import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  PrismaExceptionFilter,
  PrismaExceptionFilterKey,
} from './prisma-exception.filter';

@Catch(Error)
export class ErrorFilter extends BaseExceptionFilter {
  constructor(
    @Inject(PrismaExceptionFilterKey)
    private prismaExceptionFilter: PrismaExceptionFilter,
    private httpExceptionFilter: HttpExceptionFilter,
  ) {
    super();
  }

  private logger = new Logger(ErrorFilter.name);

  catch(error: Error, host: ArgumentsHost) {
    if (error instanceof HttpException)
      return this.httpExceptionFilter.catch(error, host);

    if (error instanceof Prisma.PrismaClientKnownRequestError)
      return this.prismaExceptionFilter.catch(error, host);

    const response: Response = host.switchToHttp().getResponse();

    this.logger.log(error);

    if (
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      return response.json(
        new InternalServerErrorException(error.name).getResponse(),
      );
    }

    if (error.stack.includes('FilterParser'))
      return response.json(
        new BadRequestException(error.message).getResponse(),
      );

    return super.catch(error, host);
  }
}
