import { IsString, IsOptional, IsEmail } from 'class-validator';

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
  @IsString()
  addressLatitude?: string;
  @IsOptional()
  @IsString()
  addressLongitude?: string;
}
