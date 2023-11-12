import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { NextFunction, Response } from 'express';

@Catch(Error)
export class ErrorFilter
  extends HttpExceptionFilter
  implements ExceptionFilter
{
  constructor() {
    super();
  }

  private _logger = new Logger(ErrorFilter.name);

  catch(error: Error, host: ArgumentsHost) {
    if (error instanceof HttpException) {
      return super.catch(error, host);
    }

    this._logger.log(error);

    const response: Response = host.switchToHttp().getResponse();
    const next: NextFunction = host.switchToHttp().getNext();

    if (error.message.includes('is not filterable'))
      return response.json(
        new BadRequestException(error.message).getResponse(),
      );

    return next();
  }
}
