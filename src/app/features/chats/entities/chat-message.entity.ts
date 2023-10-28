import { ChatMessage } from '@prisma/client';

export class ChatMessageEntity implements ChatMessage {
  constructor(partial: Partial<ChatMessageEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  chatId: number;
  recipientId: number;
  text: string;
  opened: boolean;
  updatedAt: Date;
  createdAt: Date;
}
