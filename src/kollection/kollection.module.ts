import { forwardRef, Module } from '@nestjs/common';
import { KollectionService } from './kollection.service';
import { KollectionResolver } from './kollection.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenModel } from '../token/token.model';
import { Kollection, KollectionModel } from './kollection.model';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { User, UserModel } from '../user/user.model';
import { EventService } from '../event/event.service';
import { Event, EventModel } from '../event/event.model';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Kollection.name, schema: KollectionModel },
        { name: Token.name, schema: TokenModel },
        { name: User.name, schema: UserModel },
        { name: Event.name, schema: EventModel },
      ],
      'ronia',
    ),
    forwardRef(() => TokenModule),
    forwardRef(() => UserModule),
    EventModule,
  ],
  providers: [KollectionService, KollectionResolver],
  exports: [KollectionService, KollectionResolver],
})
export class KollectionModule {}
