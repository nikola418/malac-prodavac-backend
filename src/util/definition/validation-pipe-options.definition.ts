import { ValidationPipeOptions } from '@nestjs/common';

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  },
};
