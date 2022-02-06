import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuyNow, BuyNowDocument } from './buyNow.model';
import * as NFTMarket from '../contracts/NFTMarket.json';
import {SoftDeleteModel} from "soft-delete-plugin-mongoose";
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { Erc20Service } from '../erc20/erc20.service';
import { KollectionService } from '../kollection/kollection.service';
import { Token } from '../token/token.model';
var Web3 = require('web3');
var Web3WsProvider = require('web3-providers-ws');

@Injectable()
export class BuyNowService implements OnApplicationBootstrap{
    private ws;
    private web3;
    private marketContract;
    constructor(
        @InjectModel(BuyNow.name) private buyNowModel: SoftDeleteModel<BuyNowDocument>,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly erc20Service: Erc20Service,
        private readonly kollectionService: KollectionService
    ){
        var options = {
            clientConfig: {
              // Useful to keep a connection alive
              keepalive: true,
              keepaliveInterval: 28000 // ms
            },
        
            // Enable auto reconnection
            reconnect: {
                auto: true,
                delay: 1000, // ms
                maxAttempts: 5,
                onTimeout: true
            }
          };
        this.ws = new Web3WsProvider(process.env.NETWORK_WEBSOCKET_URL, options);
        this.web3 = new Web3();
        this.web3.setProvider(this.ws)
    }
    async onApplicationBootstrap(){
        this.listenBuyNowItemCreated();
        this.listenBuyNowItemUpdated();
        this.listenBuyNowItemPurchased();
        this.listenBuyNowItemCanceled();
    }
    async findMany(){
        return this.buyNowModel.find().lean()
    }
    async findById(id) {
        return this.buyNowModel.findById(id).lean();
      }
    
    async findByItemId(itemId: number) {
    let options = {
        itemId: itemId,
    };
    return this.buyNowModel.findOne(options);
    }

    async createBuyNow(buyNow: BuyNow) {
    return this.buyNowModel.create(buyNow);
    }

    async findOrCreateByItemId(_itemId: number) {
    let res = await this.buyNowModel.findOne({itemId: _itemId})
    if(!res){
        res = await this.buyNowModel.create({itemId: _itemId})
    }
    return res
    }
    
    async removeByItemId(id: string) {
        const filter  = { itemId: id };
    
        const deleted = await this.buyNowModel.softDelete(filter);
        return deleted;
    }

    async listenBuyNowItemCreated() {
        console.log("Listening to BuyNowItemCreated...")  
        this.marketContract = new this.web3.eth.Contract(
          NFTMarket.abi,
          process.env.RONIA_MARKET,
        );
    
        this.marketContract.events.BuyNowItemCreated().on("data", async(buynowItemCreatedEvent) => {
          this.doListenBuyNowItemCreated(buynowItemCreatedEvent)
        });
    }

    async indexBuyNowItemCreated(){
        console.log("Indexing BuyNowItemCreated...")
        this.marketContract.getPastEvents('BuyNowItemCreated', {
          fromBlock: process.env.FROM_BLOCK,
          toBlock: 'latest'
        }, async (error, events) => { 
          for(let i=0; i < events.length; i++){
            await this.doListenBuyNowItemCreated(events[i])
          }
         })
    }

    async doListenBuyNowItemCreated(buyNowItemCreatedEvent){
            console.log('Buy now item created: ' + buyNowItemCreatedEvent.returnValues.itemId);
            let seller = await this.userService.findOrCreateByAddress(buyNowItemCreatedEvent.returnValues.seller);
            let kollection = await this.kollectionService.findOrCreateByContract(process.env.RONIA_NFT)
            let kollectionTokens = (await kollection.populate('tokens', 'tokenId')).tokens
            let token = kollectionTokens.find(item => {
            return item.tokenId == buyNowItemCreatedEvent.returnValues.tokenId
        })
        if(token){
            token.owner = seller
        } else{
            let createdToken: Token = new Token();
            createdToken.tokenId = buyNowItemCreatedEvent.returnValues.tokenId;
            createdToken.owner = seller;
            createdToken.kollection = kollection;
            let res = await this.tokenService.createToken(createdToken)
            kollection.tokens.push(res)
            token = res;
        }
        await kollection.save()
        let currency = await this.erc20Service.findOrCreateByAddress(buyNowItemCreatedEvent.returnValues.currency);
        let buyNowItem = await this.findOrCreateByItemId(buyNowItemCreatedEvent.returnValues.itemId);
        buyNowItem.seller = seller;
        buyNowItem.token = token;
        buyNowItem.currency = currency;

        buyNowItem.reservePrice = buyNowItemCreatedEvent.returnValues.reservePrice;
        await buyNowItem.save();
    }

    async listenBuyNowItemUpdated() {
        console.log("Listening to BuyNowItemUpdated...") 
        this.marketContract = new this.web3.eth.Contract(
          NFTMarket.abi,
          process.env.RONIA_MARKET,
        );
    
        this.marketContract.events.BuyNowItemUpdated().on("data", async(buyNowItemUpdatedEvent) => {
          this.doListenBuyNowItemUpdated(buyNowItemUpdatedEvent)
        });
    }

    async indexBuyNowItemUpdated(){
        console.log("Indexing BuyNowItemUpdated...")
        this.marketContract.getPastEvents('BuyNowItemUpdated', {
          fromBlock: process.env.FROM_BLOCK,
          toBlock: 'latest'
        }, async (error, events) => { 
          for(let i=0; i < events.length; i++){
            await this.doListenBuyNowItemUpdated(events[i])
          }
         })
    }

    async doListenBuyNowItemUpdated(buyNowItemUpdatedEvent){
        let buyNowItem = await this.findOrCreateByItemId(buyNowItemUpdatedEvent.returnValues.itemId);
        buyNowItem.reservePrice = buyNowItemUpdatedEvent.returnValues.reservePrice;
        buyNowItem.save();
    }

    async listenBuyNowItemPurchased() {
        console.log("Listening to BuyNowItemPurchased...") 
        this.marketContract = new this.web3.eth.Contract(
          NFTMarket.abi,
          process.env.RONIA_MARKET,
        );
    
        this.marketContract.events.BuyNowItemPurchased().on("data", async(buyNowItemPurchasedEvent) => {
          this.doListenBuyNowItemPurchased(buyNowItemPurchasedEvent)
        });
    }

    async indexBuyNowItemPurchased(){
        console.log("Indexing BuyNowItemPurchased...")
        this.marketContract.getPastEvents('BuyNowItemPurchased', {
          fromBlock: process.env.FROM_BLOCK,
          toBlock: 'latest'
        }, async (error, events) => { 
          for(let i=0; i < events.length; i++){
            await this.doListenBuyNowItemPurchased(events[i])
          }
         })
    }

    async doListenBuyNowItemPurchased(buyNowItemPurchasedEvent){
        let buyNowItem = await this.findOrCreateByItemId(buyNowItemPurchasedEvent.returnValues.itemId);
        buyNowItem.winner = buyNowItemPurchasedEvent.returnValues.winner;
        buyNowItem.purchasedAt = buyNowItemPurchasedEvent.returnValues.purchasedAt;
        buyNowItem.save();
    }

    async listenBuyNowItemCanceled() {
        console.log("Listening to BuyNowItemCanceled...") 
        this.marketContract = new this.web3.eth.Contract(
          NFTMarket.abi,
          process.env.RONIA_MARKET,
        );
    
        this.marketContract.events.BuyNowItemCanceled().on("data", async(buyNowItemCanceledEvent) => {
          this.doListenBuyNowItemCanceled(buyNowItemCanceledEvent)
        });
    }

    async indexBuyNowItemCanceled(){
        console.log("Indexing BuyNowItemCanceled...")
        this.marketContract.getPastEvents('BuyNowItemCanceled', {
          fromBlock: process.env.FROM_BLOCK,
          toBlock: 'latest'
        }, async (error, events) => { 
          for(let i=0; i < events.length; i++){
            await this.doListenBuyNowItemCanceled(events[i])
          }
         })
    }

    async doListenBuyNowItemCanceled(buyNowItemCanceledEvent){
        await this.removeByItemId(buyNowItemCanceledEvent.returnValues.itemId)
    }
}
