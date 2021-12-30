import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionResolver } from './auction.resolver';
import { AuctionController } from './auction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionModel } from './auction.model';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Auction.name, schema: AuctionModel}])
  ],
  providers: [AuctionService, AuctionResolver],
  controllers : [AuctionController]
})
export class AuctionModule {}
