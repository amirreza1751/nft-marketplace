import { NestFactory } from '@nestjs/core';
import { TokenModule } from '../token/token.module';
import { TokenService } from '../token/token.service';
import { AppModule } from '../app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { AuctionModule } from '../auction/auction.module';
import { AuctionService } from '../auction/auction.service';
import { BuyNowModule } from '../buy-now/buy-now.module';
import { BuyNowService } from '../buy-now/buy-now.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  await app
    .select(AppModule)
    .select(TokenModule)
    .get(TokenService)
    .indexTransfers();

  const auctionService = app
    .select(AppModule)
    .select(AuctionModule)
    .get(AuctionService);
  await auctionService.indexAuctionCreated();
  await auctionService.indexAuctionBidded();
  await auctionService.indexAuctionUpdated();
  await auctionService.indexAuctionDurationExtended();
  await auctionService.indexAuctionEnded();
  await auctionService.indexAuctionCanceled();

  const buyNowService = app
    .select(AppModule)
    .select(BuyNowModule)
    .get(BuyNowService);
  await buyNowService.indexBuyNowItemCreated();
  await buyNowService.indexBuyNowItemUpdated();
  await buyNowService.indexBuyNowItemPurchased();
  await buyNowService.indexBuyNowItemCanceled();

    // await app.close();
    // process.exit(0);
}

bootstrap();
