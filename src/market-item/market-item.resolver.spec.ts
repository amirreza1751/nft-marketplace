import { Test, TestingModule } from '@nestjs/testing';
import { MarketItemResolver } from './market-item.resolver';

describe('MarketItemResolver', () => {
  let resolver: MarketItemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketItemResolver],
    }).compile();

    resolver = module.get<MarketItemResolver>(MarketItemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
