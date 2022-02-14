import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenModel } from './token.model';
import { TokenResolver } from './token.resolver';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { User, UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Kollection, KollectionModel } from '../kollection/kollection.model';
import { KollectionService } from '../kollection/kollection.service';
import { Event, EventModel } from '../event/event.model';
import { EventService } from '../event/event.service';
import { UserModule } from '../user/user.module';
import { KollectionModule } from '../kollection/kollection.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/ronia', {
      connectionName: 'ronia',
    }),
    MongooseModule.forFeature(
      [
        { name: Token.name, schema: TokenModel },
        { name: User.name, schema: UserModel },
        { name: Kollection.name, schema: KollectionModel },
        { name: Event.name, schema: EventModel },
      ],
      'ronia',
    ),
    forwardRef(() => UserModule),
    KollectionModule,
    EventModule,
  ],
  providers: [TokenResolver, TokenService],
  controllers: [TokenController],
  exports: [TokenResolver, TokenService],
})
export class TokenModule {}
