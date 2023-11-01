import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  text: string;

  @IsInt()
  @IsPositive()
  recipientId: number;
}
