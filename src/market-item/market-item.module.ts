import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketItem, MarketItemModel } from './market-item.model';
import { MarketItemResolver } from './market-item.resolver';
import { MarketItemService } from './market-item.service';
import { MarketItemController } from './market-item.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: MarketItem.name, schema: MarketItemModel}])
  ],
  providers: [MarketItemResolver, MarketItemService],
  controllers: [MarketItemController]
})
export class MarketItemModule {}
