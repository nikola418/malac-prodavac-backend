import {
  IsString,
  IsOptional,
  IsEmail,
  Max,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  addressLatitude?: number;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  addressLongitude?: number;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
