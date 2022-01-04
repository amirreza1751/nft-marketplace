import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModel } from './user.model';
import { MarketItemService } from '../market-item/market-item.service';
import { MarketItem, MarketItemModel } from '../market-item/market-item.model';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserModel},
      {name: MarketItem.name, schema: MarketItemModel}
    ]),
  ],
  providers: [UserService, UserResolver, MarketItemService],
  controllers: [UserController]
})
export class UserModule {}
