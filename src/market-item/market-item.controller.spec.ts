import { Test, TestingModule } from '@nestjs/testing';
import { MarketItemController } from './market-item.controller';

describe('MarketItemController', () => {
  let controller: MarketItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketItemController],
    }).compile();

    controller = module.get<MarketItemController>(MarketItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
