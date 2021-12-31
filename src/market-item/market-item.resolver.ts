import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { FindMarketItemInput, MarketItem } from './market-item.model';
import { MarketItemService } from './market-item.service';

@Resolver(()=> MarketItem)
export class MarketItemResolver {

constructor(private marketItemService: MarketItemService, private userService: UserService){}

    @Query(()=> [MarketItem])
    async marketItems(){
        return this.marketItemService.findMany()
    }

    @Query(()=> MarketItem)
    async marketItem(@Args('input'){_id}: FindMarketItemInput){
        return this.marketItemService.findById(_id)
    }

    @ResolveField(() => User)
    async owner(@Parent() marketItem: MarketItem){
        return this.userService.findById(marketItem.owner)
    }
}
