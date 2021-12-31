import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModel } from './user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserModel}])
  ],
  providers: [UserService, UserResolver]
})
export class UserModule {}
