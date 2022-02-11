import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Token } from 'graphql';
import { Erc20 } from 'src/erc20/erc20.model';
import { Erc20Service } from 'src/erc20/erc20.service';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { BuyNowService } from './buy-now.service';
import { BuyNow, FindBuyNowInput } from './buyNow.model';

@Resolver(() => BuyNow)
export class BuyNowResolver {
    constructor(
        private readonly buyNowService: BuyNowService,
        private readonly erc20Service: Erc20Service,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
      ) {}

    @Query(() => [BuyNow])
    async buyNowItems() {
        return this.buyNowService.findMany();
    }

    @Query(() => BuyNow)
    async buyNowItem(@Args('input') { _id }: FindBuyNowInput) {
        return this.buyNowService.findById(_id);
    }

  @ResolveField(() => User)
  async seller(@Parent() buyNowItem: BuyNow) {
    return this.userService.findById(buyNowItem.seller);
  }

  @ResolveField(() => Token)
  async token(@Parent() buyNowItem: BuyNow) {
    return this.tokenService.findById(buyNowItem.token);
  }

  @ResolveField(() => User)
  async winner(@Parent() buyNowItem: BuyNow) {
    return this.userService.findById(buyNowItem.winner);
  }

  @ResolveField(() => Erc20)
  async currency(@Parent() buyNowItem: BuyNow) {
    return this.erc20Service.findById(buyNowItem.currency);
  }
}
