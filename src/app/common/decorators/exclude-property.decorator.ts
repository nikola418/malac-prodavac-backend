import { applyDecorators } from '@nestjs/common';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export const ExcludeProperty = () => {
  return applyDecorators(ApiHideProperty(), Exclude());
};
