import { flatten, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { Auction, AuctionDocument, AuctionModel } from './auction.model';
import * as NFTMarket from '../contracts/NFTMarket.json';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { Erc20Service } from '../erc20/erc20.service';
import { KollectionService } from '../kollection/kollection.service';
import { Token } from '../token/token.model';
var Web3 = require('web3');

@Injectable()
export class AuctionService implements OnApplicationBootstrap{
  private web3;
  private marketContract;
  private options = {
    // Enable auto reconnection
    reconnect: {
        auto: true,
        delay: 2000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
  };

  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly erc20Service: Erc20Service,
    private readonly kollectionService: KollectionService
  ) {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.NETWORK_WEBSOCKET_URL));
  }
  async onApplicationBootstrap(){
    this.listenAuctionCreated()
    this.listenAuctionBidded()
    this.listenAuctionDurationExtended()
    this.listenAuctionUpdated()
    this.listenAuctionEnded()
    this.indexAuctionCreated()
  }
  async findMany() {
    return this.auctionModel.find().lean();
  }

  async findById(id) {
    return this.auctionModel.findById(id).lean();
  }

  async findByAuctionId(auctionId: number) {
    let options = {
      auctionId: auctionId,
    };
    return this.auctionModel.findOne(options);
  }

  async findByToken(tokenId: number, contract: string) {
    return await this.auctionModel.findOne().populate('token');
  }

  async createAuction(auction: Auction) {
    return this.auctionModel.create(auction);
  }

  async findOrCreateByAuctionId(_auctionId: number) {
    let res = await this.auctionModel.findOne({auctionId: _auctionId})
    if(!res){
      res = await this.auctionModel.create({auctionId: _auctionId})
    }
    return res
  }

  async listenAuctionCreated() {
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening to auctions ...');
    this.marketContract.events.AuctionCreated().on("data", async(auctionCreatedEvent) => {
      this.doListenAuctionCreated(auctionCreatedEvent)
    });
  }

  async indexAuctionCreated(){
    this.marketContract.getPastEvents('AuctionCreated', {
      fromBlock: process.env.FROM_BLOCK,
      toBlock: 'latest'
    }, async (error, events) => { 
      for(let i=0; i < events.length; i++){
        await this.doListenAuctionCreated(events[i])
      }
     })
  }

  async doListenAuctionCreated (auctionCreatedEvent){
    console.log('Auction created: ' + auctionCreatedEvent.returnValues.auctionId);
    let seller = await this.userService.findOrCreateByAddress(auctionCreatedEvent.returnValues.seller);
    let kollection = await this.kollectionService.findOrCreateByContract(process.env.RONIA_NFT)
    let kollectionTokens = (await kollection.populate('tokens', 'tokenId')).tokens
  let token = kollectionTokens.find(item => {
    return item.tokenId == auctionCreatedEvent.returnValues.tokenId
  })
  if(token){
    token.owner = seller
  } else{
    let createdToken: Token = new Token();
    createdToken.tokenId = auctionCreatedEvent.returnValues.tokenId;
    createdToken.owner = seller;
    createdToken.kollection = kollection;
    // createdToken.tokenUri = _tokenUri; get token URI from contract
    let res = await this.tokenService.createToken(createdToken)
    kollection.tokens.push(res)
    token = res;
  }
    await kollection.save()
    let auctionCurrency = await this.erc20Service.findOrCreateByAddress(auctionCreatedEvent.returnValues.auctionCurrency);
    let auction = await this.findOrCreateByAuctionId(auctionCreatedEvent.returnValues.auctionId);
    auction.seller = seller;
    auction.token = token;
    auction.auctionCurrency = auctionCurrency;

    auction.startTime = auctionCreatedEvent.returnValues.startTime;
    auction.endTime = auctionCreatedEvent.returnValues.endTime;
    auction.reservePrice = auctionCreatedEvent.returnValues.reservePrice;
    auction.ended = false;
    await auction.save();
  }
  
  async listenAuctionBidded(){
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening to auctions bidded...');
    this.marketContract.events.AuctionBidded().on("data", async (auctionBiddedEvent)=>{
        this.doListenAuctionBidded(auctionBiddedEvent)
    });
  }

  async indexAuctionBidded(){
    this.marketContract.getPastEvents('AuctionBidded', {
      fromBlock: process.env.FROM_BLOCK,
      toBlock: 'latest'
    }, async (error, events) => { 
      for(let i=0; i < events.length; i++){
        await this.doListenAuctionBidded(events[i])
      }
     })
  }

  async doListenAuctionBidded(auctionBiddedEvent){
    let sender = await this.userService.findOrCreateByAddress(auctionBiddedEvent.returnValues.sender);
        let auction = await this.findOrCreateByAuctionId(auctionBiddedEvent.returnValues.auctionId);
        console.log(auctionBiddedEvent.returnValues)
        auction.bidder = sender;
        auction.bid = auctionBiddedEvent.returnValues.amount;
        auction.save();
  }

  
  async listenAuctionDurationExtended(){
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening to auctions duration extended...');
    this.marketContract.events.AuctionDurationExtended().on("data", async (auctionDurationExtendedEvent)=>{
        this.doListenAuctionDurationExtended(auctionDurationExtendedEvent)
      }
    );
  }

  async indexAuctionDurationExtended(){
    this.marketContract.getPastEvents('AuctionDurationExtended', {
      fromBlock: process.env.FROM_BLOCK,
      toBlock: 'latest'
    }, async (error, events) => { 
      for(let i=0; i < events.length; i++){
        await this.doListenAuctionDurationExtended(events[i])
      }
     })
  }
  
  async doListenAuctionDurationExtended(auctionDurationExtendedEvent){
    let auction = await this.findOrCreateByAuctionId(auctionDurationExtendedEvent.returnValues.auctionId);
        auction.endTime = auctionDurationExtendedEvent.returnValues.newEndTime;
        auction.save();
  }
  
  async listenAuctionUpdated(){
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening to auctions updated...');
    this.marketContract.events.AuctionUpdated().on("data", async (auctionUpdatedEvent)=>{
      this.doListenAuctionUpdated(auctionUpdatedEvent)
    });
  }

  async indexAuctionUpdated(){
    this.marketContract.getPastEvents('AuctionUpdated', {
      fromBlock: process.env.FROM_BLOCK,
      toBlock: 'latest'
    }, async (error, events) => { 
      for(let i=0; i < events.length; i++){
        await this.doListenAuctionUpdated(events[i])
      }
     })
  }

  async doListenAuctionUpdated(auctionUpdatedEvent){
    let auction = await this.findOrCreateByAuctionId(auctionUpdatedEvent.returnValues.auctionId);
    auction.reservePrice = auctionUpdatedEvent.returnValues.reservePrice;
    auction.save();
  }
  
  async listenAuctionEnded(){
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening to auctions ended...');
    this.marketContract.events.AuctionEnded().on("data", async (auctionEndedEvent)=>{
      this.doListenAuctionEnded(auctionEndedEvent)
    });
  }

  async indexAuctionEnded(){
    this.marketContract.getPastEvents('AuctionEnded', {
      fromBlock: process.env.FROM_BLOCK,
      toBlock: 'latest'
    }, async (error, events) => { 
      for(let i=0; i < events.length; i++){
        await this.doListenAuctionEnded(events[i])
      }
     })
  }

  async doListenAuctionEnded(auctionEndedEvent){
    let auction = await this.findOrCreateByAuctionId(auctionEndedEvent.returnValues.auctionId);
    auction.ended = true;
    auction.save();
  }

}
