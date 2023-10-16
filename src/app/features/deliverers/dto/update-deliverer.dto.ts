import { PartialType } from '@nestjs/swagger';
import { CreateDelivererDto } from './create-deliverer.dto';

export class UpdateDelivererDto extends PartialType(CreateDelivererDto) {}
