import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { Token, TokenModel } from '../token/token.model';
import { User, UserModel } from '../user/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventModel } from './event.model';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { KollectionService } from '../kollection/kollection.service';
import { Kollection, KollectionModel } from '../kollection/kollection.model';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { KollectionModule } from '../kollection/kollection.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Event.name, schema: EventModel },
        { name: Token.name, schema: TokenModel },
        { name: User.name, schema: UserModel },
        { name: Kollection.name, schema: KollectionModel },
      ],
      'ronia',
    ),
    forwardRef(() => TokenModule),
    forwardRef(() => UserModule),
    forwardRef(() => KollectionModule),
  ],
  providers: [EventService, EventResolver],
  exports: [EventService, EventResolver],
})
export class EventModule {}
