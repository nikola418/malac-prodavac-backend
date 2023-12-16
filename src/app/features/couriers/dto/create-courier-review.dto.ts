import { IsString, IsInt, IsPositive, Max } from 'class-validator';

export class CreateCourierReviewDto {
  @IsString()
  text: string;

  @IsInt()
  @IsPositive()
  @Max(5)
  rating: number;
}
