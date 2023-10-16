import { Test, TestingModule } from '@nestjs/testing';
import { DeliverersController } from './deliverers.controller';
import { DeliverersService } from './deliverers.service';

describe('DeliverersController', () => {
  let controller: DeliverersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliverersController],
      providers: [DeliverersService],
    }).compile();

    controller = module.get<DeliverersController>(DeliverersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
