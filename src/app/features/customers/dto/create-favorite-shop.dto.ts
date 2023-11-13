import { IsInt, IsPositive } from 'class-validator';

export class CreateFavoriteShopDto {
  @IsInt()
  @IsPositive()
  shopId: number;
}
