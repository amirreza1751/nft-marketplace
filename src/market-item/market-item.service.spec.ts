import { Test, TestingModule } from '@nestjs/testing';
import { MarketItemService } from './market-item.service';

describe('MarketItemService', () => {
  let service: MarketItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketItemService],
    }).compile();

    service = module.get<MarketItemService>(MarketItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
