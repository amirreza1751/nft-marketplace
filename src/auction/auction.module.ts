import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionResolver } from './auction.resolver';
import { AuctionController } from './auction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionModel } from './auction.model';
import { Erc20Service } from '../erc20/erc20.service';
import { UserService } from '../user/user.service';
import { User, UserModel } from '../user/user.model';
import { Erc20, Erc20Model } from '../erc20/erc20.model';
import { TokenService } from '../token/token.service';
import { Token, TokenModel } from '../token/token.model';
import { KollectionService } from '../kollection/kollection.service';
import { Kollection, KollectionModel } from '../kollection/kollection.model';
import { EventService } from '../event/event.service';
import { Event, EventModel } from '../event/event.model';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { Erc20Module } from '../erc20/erc20.module';
import { KollectionModule } from '../kollection/kollection.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionModel },
      { name: User.name, schema: UserModel },
      { name: Erc20.name, schema: Erc20Model },
      { name: Token.name, schema: TokenModel },
      { name: Kollection.name, schema: KollectionModel },
      {name: Event.name, schema: EventModel}
    ], 'ronia'),
    TokenModule,
    UserModule,
    Erc20Module,
    KollectionModule,
    EventModule
  ],
  providers: [
    AuctionService,
    AuctionResolver,
  ],
  controllers: [AuctionController],
  exports: [
    AuctionService,
    AuctionResolver,
  ]
})
export class AuctionModule {}
