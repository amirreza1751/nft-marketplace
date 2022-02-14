import { Test, TestingModule } from '@nestjs/testing';
import { BidResolver } from './bid.resolver';

describe('BidResolver', () => {
  let resolver: BidResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidResolver],
    }).compile();

    resolver = module.get<BidResolver>(BidResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
