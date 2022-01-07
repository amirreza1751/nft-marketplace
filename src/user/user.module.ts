import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModel } from './user.model';
import { TokenService } from '../token/token.service';
import { Token, TokenModel } from '../token/token.model';
import { UserController } from './user.controller';
import { KollectionService } from '../kollection/kollection.service';
import { Kollection, KollectionModel } from '../kollection/kollection.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserModel },
      { name: Token.name, schema: TokenModel },
      { name: Kollection.name, schema: KollectionModel }
    ]),
  ],
  providers: [UserService, UserResolver, TokenService, KollectionService],
  controllers: [UserController],
})
export class UserModule {}
