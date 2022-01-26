import { NestFactory } from '@nestjs/core';
import { AuctionService } from '../auction/auction.service';
import { AppModule } from '../app.module';
import { TokenService } from '../token/token.service';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);

  const command = process.argv[2];

  switch (command) {
    case 'listen':
      const tokenService = application.get(TokenService);
      await tokenService.listenOnTransfer();

      const auctionService = application.get(AuctionService);
      await auctionService.listenOnAuctionCreated();
      // await auctionService.listenOnAuctionBidded();
      // await auctionService.listenOnAuctionDurationExtended();
      // await auctionService.listenOnAuctionEnded();
      // await auctionService.listenOnAuctionUpdated();

      break;
    default:
      console.log('Command not found');
      process.exit(1);
  }

  // await application.close();
  // process.exit(0);
}

bootstrap();
