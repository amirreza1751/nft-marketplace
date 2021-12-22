import { Args, Query, Resolver } from '@nestjs/graphql';
import { FindMarketItemInput, MarketItem } from './market-item.model';
import { MarketItemService } from './market-item.service';

@Resolver()
export class MarketItemResolver {

constructor(private readonly marketItemService: MarketItemService){}

    @Query(()=> [MarketItem])
    async marketItems(){
        return this.marketItemService.findMany()
    }

    @Query(()=> MarketItem)
    async marketItem(@Args('input'){_id}: FindMarketItemInput){
        return this.marketItemService.findById(_id)
    }
}
