import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { Auction } from './auction.model';
import { AuctionService } from './auction.service';

@Resolver()
export class AuctionResolver {
    constructor(private readonly auctionService: AuctionService){}
    
    @Query(() => [Auction])
    async Auctions(){
        return this.auctionService.findMany()
    }
}
