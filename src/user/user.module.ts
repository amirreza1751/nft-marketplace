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
import { EventService } from '../event/event.service';
import { Event, EventModel } from '../event/event.model';
import { TokenModule } from '../token/token.module';
import { KollectionModule } from '../kollection/kollection.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserModel },
      { name: Token.name, schema: TokenModel },
      { name: Kollection.name, schema: KollectionModel },
      {name: Event.name, schema:EventModel}
    ], 'ronia'),
    forwardRef(() => TokenModule),
    UserModule,
    KollectionModule
  ],
  providers: [UserService, UserResolver],
  controllers: [UserController],
  exports: [UserService, UserResolver]
})
export class UserModule {}
