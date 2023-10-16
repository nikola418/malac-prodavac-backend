import { Test, TestingModule } from '@nestjs/testing';
import { DeliverersService } from './deliverers.service';

describe('DeliverersService', () => {
  let service: DeliverersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliverersService],
    }).compile();

    service = module.get<DeliverersService>(DeliverersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
