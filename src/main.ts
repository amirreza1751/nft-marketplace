import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Commands } from './commands/indexer'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
Commands.indexer()