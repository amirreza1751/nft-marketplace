import { NestFactory } from '@nestjs/core';
import { AuctionService } from '../auction/auction.service';
import { AppModule } from '../app.module';
import { TokenService } from '../token/token.service';
import { BuyNowService } from '../buy-now/buy-now.service';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);

  const command = process.argv[2];

  switch (command) {
    case 'index':
      const tokenService = application.get(TokenService);
      await tokenService.indexTransfers();

      const auctionService = application.get(AuctionService);
      await auctionService.indexAuctionCreated();
      await auctionService.indexAuctionBidded();
      await auctionService.indexAuctionDurationExtended();
      await auctionService.indexAuctionUpdated();
      await auctionService.indexAuctionEnded();

      const buyNowService = application.get(BuyNowService)
      await buyNowService.indexBuyNowItemCreated();
      await buyNowService.indexBuyNowItemUpdated();
      await buyNowService.indexBuyNowItemPurchased();
      await buyNowService.indexBuyNowItemCanceled();
      
      break;
    default:
      console.log('Command not found');
      process.exit(1);
  }

  await application.close();
  process.exit(0);
}

bootstrap();
