import { Args, Parent, Query, ResolveField } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { User } from '../user/user.model';
import { Erc20 } from '../erc20/erc20.model';
import { Erc20Service } from '../erc20/erc20.service';
import { Auction, FindAuctionInput } from './auction.model';
import { AuctionService } from './auction.service';
import { UserService } from '../user/user.service';
import { MarketItem } from '../market-item/market-item.model';
import { MarketItemService } from '../market-item/market-item.service';

@Resolver(()=> Auction)
export class AuctionResolver {
    constructor(
        private readonly auctionService: AuctionService,
        private readonly erc20Service: Erc20Service,
        private readonly userService: UserService,
        private readonly marketItemService: MarketItemService
    ){}
    
    @Query(() => [Auction])
    async auctions(){
        return this.auctionService.findMany()
    }
    
    @Query(()=> Auction)
    async auction(@Args('input'){_id}: FindAuctionInput){
        return this.auctionService.findById(_id)
    }



    @ResolveField(() => User)
    async seller(@Parent() auction: Auction){
        return this.userService.findById(auction.seller)
    }

    @ResolveField(() => MarketItem)
    async marketItem(@Parent() auction: Auction){
        return this.marketItemService.findById(auction.marketItem)
    }

    @ResolveField(() => User)
    async bidder(@Parent() auction: Auction){
        return this.userService.findById(auction.bidder)
    }

    @ResolveField(() => Erc20)
    async auctionCurrency(@Parent() auction: Auction){
        return this.erc20Service.findById(auction.auctionCurrency)
    }
}
