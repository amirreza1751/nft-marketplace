import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { Token } from '../token/token.model';
import { TokenService } from '../token/token.service';
import { FindUserInput, User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  @Query(() => [User])
  async users() {
    return this.userService.findMany();
  }

  @Query(() => User)
  async user(@Args('input') { _id }: FindUserInput) {
    return this.userService.findById(_id);
  }

  @ResolveField()
  async tokens(@Parent() parent: User) {
    return this.tokenService.findMany({owner: parent});
  }
}
