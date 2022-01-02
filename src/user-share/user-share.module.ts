import { Module } from '@nestjs/common';
import { UserShareService } from './user-share.service';

@Module({
  providers: [UserShareService]
})
export class UserShareModule {}
