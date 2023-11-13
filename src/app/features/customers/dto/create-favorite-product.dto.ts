import { IsInt, IsPositive } from 'class-validator';

export class CreateFavoriteProductDto {
  @IsInt()
  @IsPositive()
  productId: number;
}
