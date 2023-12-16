import { IsString, MinLength } from 'class-validator';

export class CreateProductQuestionDto {
  @IsString({ message: 'Text must be a string!' })
  @MinLength(1, { message: 'Text must not be an empty string!' })
  text: string;
}
