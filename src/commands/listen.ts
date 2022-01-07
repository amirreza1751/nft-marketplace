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
      await tokenService.listen();

      const auctionService = application.get(AuctionService);
      await auctionService.listen();

      break;
    default:
      console.log('Command not found');
      process.exit(1);
  }

  // await application.close();
  // process.exit(0);
}

bootstrap();
