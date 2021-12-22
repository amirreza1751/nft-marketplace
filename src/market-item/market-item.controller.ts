import { Body, Controller, Post } from '@nestjs/common';
import { MarketItem } from './market-item.model';
import { MarketItemService } from './market-item.service';

@Controller('market-item')
export class MarketItemController {
    constructor(private readonly marketItemService: MarketItemService){}

    @Post()
    async createMarketItem(@Body()marketItem: MarketItem){
        return this.marketItemService.createMarketItem(marketItem)
    }
}
