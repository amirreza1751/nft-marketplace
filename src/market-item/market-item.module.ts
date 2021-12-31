import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketItem, MarketItemModel } from './market-item.model';
import { MarketItemResolver } from './market-item.resolver';
import { MarketItemService } from './market-item.service';
import { MarketItemController } from './market-item.controller';
import { User, UserModel } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: MarketItem.name, schema: MarketItemModel},
      {name: User.name, schema: UserModel}])
  ],
  providers: [MarketItemResolver, MarketItemService, UserService],
  controllers: [MarketItemController]
})
export class MarketItemModule {}
