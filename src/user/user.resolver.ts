import { Resolver, Query, ResolveField, Parent, Args, Field } from '@nestjs/graphql';
import { Auction } from 'src/auction/auction.model';
import { BuyNow } from 'src/buy-now/buyNow.model';
import { Token } from '../token/token.model';
import { TokenService } from '../token/token.service';
import { FindUserByAddressInput, FindUserInput, User } from './user.model';
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

  @Query(() => User)
  async userByAddress(@Args('input') { address }: FindUserByAddressInput) {
    return this.userService.findByAddress(address)
  }
  
  @ResolveField(()=> [Token])
  async ownedTokens(@Parent() parent: User) {
    return this.userService.ownedTokens(parent.address);
  }

  @ResolveField(()=> [Token])
  async createdTokens(@Parent() parent: User) {
    return this.userService.createdTokens(parent.address);
  }

  @ResolveField(()=> [Auction])
  async createdAuctions(@Parent() parent: User) {
    return this.userService.createdAuctions(parent.address);
  }

  @ResolveField(()=> [BuyNow])
  async createdBuyNowItems(@Parent() parent: User) {
    return this.userService.createdBuyNowItems(parent.address);
  }

  @ResolveField()
  async tokens(@Parent() parent: User) {
    return this.tokenService.findMany({owner: parent});
  }
}
