import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Kollection } from '../kollection/kollection.model';
import { KollectionService } from '../kollection/kollection.service';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { FindTokenInput, Token } from './token.model';
import { TokenService } from './token.service';

@Resolver(() => Token)
export class TokenResolver {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private kollectionService: KollectionService
  ) {}

  @Query(() => [Token])
  async tokens() {
    return this.tokenService.findMany();
  }

  @Query(() => Token)
  async token(@Args('input') { _id }: FindTokenInput) {
    return this.tokenService.findById(_id);
  }

  @ResolveField(() => User)
  async owner(@Parent() token: Token) {
    return this.userService.findById(token.owner);
  }

  @ResolveField(() => Kollection)
  async kollection(@Parent() token: Token) {
    return this.kollectionService.findById(token.kollection);
  }
}
