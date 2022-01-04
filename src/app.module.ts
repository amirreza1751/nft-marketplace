import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketItemModule } from './market-item/market-item.module';
import { AuctionController } from './auction/auction.controller';
import { AuctionModule } from './auction/auction.module';
import { UserModule } from './user/user.module';
import { configuration } from '../config/configuration'; // this is new
// import { UserShareModule } from './user-share/user-share.module';
import { Erc20Module } from './erc20/erc20.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    }),
    ConfigModule.forRoot({ 
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration] 
   }),
    MarketItemModule,
    AuctionModule,
    UserModule,
    Erc20Module,
    // UserShareModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
