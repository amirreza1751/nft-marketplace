import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionResolver } from './auction.resolver';
import { AuctionController } from './auction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionModel } from './auction.model';
import { Erc20Service } from '../erc20/erc20.service';
import { UserService } from '../user/user.service';
import { User, UserModel } from '../user/user.model';
import { Erc20, Erc20Model } from '../erc20/erc20.model';
import { MarketItemService } from '../market-item/market-item.service';
import { MarketItem, MarketItemModel } from '../market-item/market-item.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Auction.name, schema: AuctionModel},
      {name: User.name, schema: UserModel},
      {name: Erc20.name, schema: Erc20Model},
      {name: MarketItem.name, schema: MarketItemModel}
    ]),
  ],
  providers: [AuctionService, AuctionResolver, UserService, MarketItemService, Erc20Service],
  controllers : [AuctionController]
})
export class AuctionModule {}
