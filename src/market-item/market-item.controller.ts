import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MarketItem } from './market-item.model';
import { MarketItemService } from './market-item.service';

@Controller('market-item')
export class MarketItemController {
    constructor(private readonly marketItemService: MarketItemService){}

    @Post()
    async createMarketItem(@Body()marketItem: MarketItem){
        return this.marketItemService.createMarketItem(marketItem)
    }

    @Get(':id/:address')
    async findbytokenIdAndContract(@Param('id')id: number, @Param('address') address: string){
        return this.marketItemService.findByTokenIdAndContract(id, address)
    }
}
