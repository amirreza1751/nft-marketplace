import { Test, TestingModule } from '@nestjs/testing';
import { BuyNowService } from './buy-now.service';

describe('BuyNowService', () => {
  let service: BuyNowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyNowService],
    }).compile();

    service = module.get<BuyNowService>(BuyNowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
