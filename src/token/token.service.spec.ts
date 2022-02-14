import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { EventModel } from '../event/event.model';
import { EventService } from '../event/event.service';
import { Kollection, KollectionModel } from '../kollection/kollection.model';
import { KollectionService } from '../kollection/kollection.service';
import { User, UserModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Token, TokenModel } from './token.model';
import { TokenResolver } from './token.resolver';
import { TokenService } from './token.service';

describe('EventService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Token.name, schema: TokenModel },
          { name: User.name, schema: UserModel },
          { name: Kollection.name, schema: KollectionModel },
          { name: Event.name, schema: EventModel },
        ]),
      ],
      providers: [
        TokenResolver,
        TokenService,
        UserService,
        KollectionService,
        EventService,
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
