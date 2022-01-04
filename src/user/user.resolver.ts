import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { MarketItem } from '../market-item/market-item.model';
import { MarketItemService } from '../market-item/market-item.service';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(()=> User)
export class UserResolver {

    constructor(
        private userService: UserService,
        private marketItemService: MarketItemService    
    ){}

    @Query(() => [User])
    async users() {
      return this.userService.findMany();
    }
  
    @ResolveField(()=> [MarketItem])
    async MarketItems(@Parent() parent: User) {
      return this.marketItemService.findByOwnerId(parent._id);
    }
}
