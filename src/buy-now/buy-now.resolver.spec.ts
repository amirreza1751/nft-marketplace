import { Test, TestingModule } from '@nestjs/testing';
import { BuyNowResolver } from './buy-now.resolver';

describe('BuyNowResolver', () => {
  let resolver: BuyNowResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyNowResolver],
    }).compile();

    resolver = module.get<BuyNowResolver>(BuyNowResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
