import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { AuctionController } from './auction/auction.controller';
import { AuctionModule } from './auction/auction.module';
import { UserModule } from './user/user.module';
import { configuration } from '../config/configuration'; // this is new
// import { UserShareModule } from './user-share/user-share.module';
import { Erc20Module } from './erc20/erc20.module';
import { KollectionModule } from './kollection/kollection.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    TokenModule,
    AuctionModule,
    UserModule,
    Erc20Module,
    KollectionModule,
    EventModule,
    // UserShareModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
