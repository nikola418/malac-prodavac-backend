import { IsInt, IsPositive, IsString, Max } from 'class-validator';

export class CreateCustomerReviewDto {
  @IsString()
  text: string;

  @IsInt()
  @IsPositive()
  @Max(5)
  rating: number;
}
