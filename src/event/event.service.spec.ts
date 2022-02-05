import { forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Kollection, KollectionModel } from 'src/kollection/kollection.model';
import { KollectionModule } from 'src/kollection/kollection.module';
import { Token, TokenModel } from 'src/token/token.model';
import { TokenModule } from 'src/token/token.module';
import { User, UserModel } from 'src/user/user.model';
import { UserModule } from 'src/user/user.module';
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
        forwardRef(() => KollectionModule)
      ],
      providers: [EventService, EventResolver],
        }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
