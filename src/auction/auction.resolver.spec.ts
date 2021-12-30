import { Test, TestingModule } from '@nestjs/testing';
import { AuctionResolver } from './auction.resolver';

describe('AuctionResolver', () => {
  let resolver: AuctionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuctionResolver],
    }).compile();

    resolver = module.get<AuctionResolver>(AuctionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
