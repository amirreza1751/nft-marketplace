import {
  Injectable, OnApplicationBootstrap
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { Token, TokenDocument } from './token.model';
import * as NFT from '../contracts/NFT.json';
import { KollectionService } from '../kollection/kollection.service';
import { EventService } from '../event/event.service';
import { Event } from '../event/event.model';
var Web3 = require('web3');
@Injectable()
export class TokenService implements OnApplicationBootstrap{
  private web3;
  private tokenContract;

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private userService: UserService,
    private kollectionService: KollectionService,
    private eventService: EventService
  ) {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.NETWORK_WEBSOCKET_URL));
    console.log("test" + this.web3.eth.Contract.transactionBlockTimeout)
    this.web3.eth.Contract.transactionBlockTimeout = 28800
    console.log("test" + this.web3.eth.Contract.transactionBlockTimeout)

  }
  onApplicationBootstrap(){
    console.log("token module created!")
    this.listenOnTransfer()
  }
  async findMany(options?) {
    return this.tokenModel.find(options).lean();
  }

  async findById(id) {
    return this.tokenModel.findById(id)
  }

  async createToken(_token: Token){
    return this.tokenModel.create(_token)
  }

  async findByOwnerId(ownerId) {
    return this.tokenModel.findOne({ owner: ownerId });
  }

  async listenOnTransfer() {
    
    this.tokenContract = new this.web3.eth.Contract(
      NFT.abi,
      process.env.RONIA_NFT
    );

    console.log('listening on transfers started...');
    this.tokenContract.events.Transfer().on('data', async transferEvent =>{
      console.log("transfer!!!!")
      let tokenUri = await this.tokenContract.methods.tokenURI(transferEvent.returnValues.tokenId).call();
      console.log(tokenUri)
      let kollection = await this.kollectionService.findOrCreateByContract(process.env.RONIA_NFT);
      let owner = await this.userService.findOrCreateByAddress(transferEvent.returnValues.to)
      let kollectionTokens = (await kollection.populate('tokens', 'tokenId')).tokens
      let kollectionToken = kollectionTokens.find(item => {
        return item.tokenId == transferEvent.returnValues.tokenId
      })

      let formerOwner = await this.userService.findOrCreateByAddress(transferEvent.returnValues.from)
      let formerOwnerTokens = (await formerOwner.populate('tokens', 'tokenId')).tokens
      let formerOwnerToken = formerOwnerTokens.find(item => {
        return item.tokenId == transferEvent.returnValues.tokenId
      })
      if(formerOwnerToken){
        formerOwnerTokens.splice(formerOwnerTokens.indexOf(formerOwnerToken), 1);
      }
      await formerOwner.save()

      let event: Event = new Event();
      event.from = formerOwner;
      event.to = owner;
      let createdEvent = await this.eventService.createEvent(event);
      
      if(kollectionToken){
        kollectionToken.owner = owner
        kollectionToken.events.push(createdEvent)
        var res = kollectionToken
      } else{
        let createdToken: Token = new Token();
        createdToken.tokenId = transferEvent.returnValues.tokenId;
        createdToken.owner = owner;
        createdToken.kollection = kollection;
        createdToken.tokenUri = tokenUri;
        createdToken.events = [createdEvent]
        res = await this.createToken(createdToken)
        kollection.tokens.push(res)
      }
      await kollection.save()
      
      createdEvent.token = res;
      createdEvent.save()


      let userTokens = (await owner.populate('tokens', 'tokenId')).tokens
      let userToken = userTokens.find(item => {
        return item.tokenId == transferEvent.returnValues.tokenId
      })
      if(!userToken){
        // owner.tokens.push(res);
        userTokens.push(res);
      }
      await owner.save()

      //create event in event table

    });
  }
}
