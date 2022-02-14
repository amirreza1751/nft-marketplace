import { forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Kollection, KollectionModel } from '../kollection/kollection.model';
import { KollectionModule } from '../kollection/kollection.module';
import { Token, TokenModel } from '../token/token.model';
import { TokenModule } from '../token/token.module';
import { User, UserModel } from '../user/user.model';
import { UserModule } from '../user/user.module';
import { EventModel } from './event.model';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Event.name, schema: EventModel },
          { name: Token.name, schema: TokenModel },
          { name: User.name, schema: UserModel },
          { name: Kollection.name, schema: KollectionModel },
        ]),
        TokenModule,
        forwardRef(() => UserModule),
        forwardRef(() => KollectionModule),
      ],
      providers: [EventService, EventResolver],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
