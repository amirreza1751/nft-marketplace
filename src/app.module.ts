import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketItemModule } from './market-item/market-item.module';
import { AuctionController } from './auction/auction.controller';
import { AuctionModule } from './auction/auction.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    }),
    ConfigModule.forRoot(),
    MarketItemModule,
    AuctionModule],
  controllers: [AppController, AuctionController],
  providers: [AppService],
})
export class AppModule {}
