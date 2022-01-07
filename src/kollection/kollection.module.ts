import { Module } from '@nestjs/common';
import { KollectionService } from './kollection.service';
import { KollectionResolver } from './kollection.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenModel } from '../token/token.model';
import { Kollection, KollectionModel } from './kollection.model';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { User, UserModel } from '../user/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Kollection.name, schema: KollectionModel },
      { name: Token.name, schema: TokenModel },
      { name: User.name, schema: UserModel },
    ]),
  ],
  providers: [KollectionService, KollectionResolver, TokenService, UserService],
})
export class KollectionModule {}
