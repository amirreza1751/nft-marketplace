import { Controller, Get, Param } from '@nestjs/common';
import { AuctionService } from './auction.service';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get('test/:tokenId/:contract')
  async test(
    @Param('tokenId') tokenId: number,
    @Param('contract') contract: string,
  ) {
    console.log(tokenId);
    console.log(contract);
    return await this.auctionService.findByToken(tokenId, contract);
  }
}
