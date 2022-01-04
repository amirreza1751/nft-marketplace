import { NestFactory } from '@nestjs/core';
import { AuctionService } from '../auction/auction.service';
import { AppModule } from '../app.module';
import { MarketItemService } from '../market-item/market-item.service';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(
    AppModule,
  );

  const command = process.argv[2];

  switch (command) {
    case 'listen':
      const marketItemService = application.get(MarketItemService);
      await marketItemService.listen()
      
      const auctionService = application.get(AuctionService)
      await auctionService.listen()

      break;
    default:
      console.log('Command not found');
      process.exit(1);
  }

  // await application.close();
  // process.exit(0);
}

bootstrap();