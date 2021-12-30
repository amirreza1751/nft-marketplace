import { WebSocketProvider } from "@ethersproject/providers";
import { OnModuleInit } from "@nestjs/common";
import { ethers } from "ethers"
import { Auction } from "src/auction/auction.model";
import { AuctionService } from "src/auction/auction.service";
import * as NFT from '../contracts/NFT.json'
import * as NFTMarket from '../contracts/NFTMarket.json'
export class Listener implements OnModuleInit{
    
    constructor(private readonly auctionService: AuctionService){
        
    }
    async listen(){
            console.log("listening started...")
            // this.marketContract.on("AuctionCreated", (auctionId, tokenId, tokenContract, startTime, endTime, reservePrice, seller, auctionCurrency) => {
            //     console.log("Auction created: " + tokenId.toNumber())                
                let res = await this.auctionService.findByAuctionId('123456789')
                if(res){
                    console.log("auction exists.")
                } else {
                    console.log("auction is new.")
                }
            // });
    }

    onModuleInit(){
        this.listen()
    }
}