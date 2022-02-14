import { Module } from '@nestjs/common';
import { BuyNowService } from './buy-now.service';
import { BuyNowResolver } from './buy-now.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { BuyNow, BuyNowModel } from './buyNow.model';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { Erc20Module } from '../erc20/erc20.module';
import { KollectionModule } from '../kollection/kollection.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: BuyNow.name, schema: BuyNowModel }],
      'ronia',
    ),
    UserModule,
    TokenModule,
    Erc20Module,
    KollectionModule,
  ],
  providers: [BuyNowService, BuyNowResolver],
  exports: [BuyNowResolver, BuyNowService],
})
export class BuyNowModule {}
