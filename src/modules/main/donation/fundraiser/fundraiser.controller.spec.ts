import { Test, TestingModule } from '@nestjs/testing';
import { FundraiserController } from './fundraiser.controller';

describe('FundraiserController', () => {
  let controller: FundraiserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundraiserController],
    }).compile();

    controller = module.get<FundraiserController>(FundraiserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
