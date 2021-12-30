import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuctionService } from './auction/auction.service';
import { Commands } from './commands/indexer'
import { Listener } from './commands/listener';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
// Commands.indexer()