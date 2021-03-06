import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { Token, TokenDocument } from './token.model';
import * as NFT from '../contracts/NFT.json';
import { KollectionService } from '../kollection/kollection.service';
import { EventService } from '../event/event.service';
import { Event } from '../event/event.model';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

var Web3 = require('web3');
var Web3WsProvider = require('web3-providers-ws');
@Injectable()
export class TokenService implements OnApplicationBootstrap {
  private ws;
  private web3;
  private tokenContract;

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    @InjectConnection('ronia') private connection: Connection,
    private userService: UserService,
    private kollectionService: KollectionService,
    private eventService: EventService,
  ) {
    var options = {
      clientConfig: {
        keepalive: true,
        keepaliveInterval: 28000, // ms
      },
      reconnect: {
        auto: true,
        delay: 1000, // ms
        maxAttempts: 5,
        onTimeout: true,
      },
    };
    this.ws = new Web3WsProvider(process.env.NETWORK_WEBSOCKET_URL, options);
    this.web3 = new Web3();
    this.web3.setProvider(this.ws);
    this.tokenContract = new this.web3.eth.Contract(
      NFT.abi,
      process.env.RONIA_NFT,
    );
  }
  async onApplicationBootstrap() {
    this.listenTransfer();
  }

  async findMany(options?) {
    return this.tokenModel.find(options);
  }

  async findById(id) {
    return this.tokenModel.findById(id);
  }

  async createToken(_token: Token) {
    return this.tokenModel.create(_token);
  }

  async findByOwnerId(ownerId) {
    return this.tokenModel.findOne({ owner: ownerId });
  }

  async listenTransfer() {
    console.log('Listening to Transfer ...');
    this.tokenContract.events.Transfer().on('data', async (transferEvent) => {
      await this.doListenTransfer(transferEvent);
    });
  }
  async doListenTransfer(transferEvent) {
    console.log(
      'Transfer! tokenId: ' +
        transferEvent.returnValues.tokenId +
        ' from: ' +
        transferEvent.returnValues.from +
        ' to: ' +
        transferEvent.returnValues.to,
    );
    let tokenUri = await this.tokenContract.methods
      .tokenURI(transferEvent.returnValues.tokenId)
      .call();
    let kollection = await this.kollectionService.findOrCreateByContract(
      process.env.RONIA_NFT,
    );
    let owner = await this.userService.findOrCreateByAddress(
      transferEvent.returnValues.to,
    );
    let kollectionTokens = (await kollection.populate('tokens', 'tokenId'))
      .tokens;
    let kollectionToken = kollectionTokens.find((item) => {
      return item.tokenId == transferEvent.returnValues.tokenId;
    });

    let formerOwner = await this.userService.findOrCreateByAddress(
      transferEvent.returnValues.from,
    );
    let formerOwnerTokens = (await formerOwner.populate('tokens', 'tokenId'))
      .tokens;
    let formerOwnerToken = formerOwnerTokens.find((item) => {
      return item.tokenId == transferEvent.returnValues.tokenId;
    });
    if (formerOwnerToken) {
      formerOwnerTokens.splice(formerOwnerTokens.indexOf(formerOwnerToken), 1);
    }
    await formerOwner.save();

    let createdEvent = await this.eventService.findOrCreateByTxHash(
      transferEvent.transactionHash,
    );
    createdEvent.from = formerOwner;
    createdEvent.to = owner;

    if (kollectionToken) {
      let existingToken = await this.findById(kollectionToken._id);
      existingToken.owner = owner;
      if (!existingToken.events) existingToken.events = [createdEvent];
      else existingToken.events.push(createdEvent);
      var res = await existingToken.save();
    } else {
      let createdToken: Token = new Token();
      createdToken.tokenId = transferEvent.returnValues.tokenId;
      createdToken.owner = owner;
      createdToken.kollection = kollection;
      createdToken.tokenUri = tokenUri;
      createdToken.events = [createdEvent];
      if (
        transferEvent.returnValues.from ==
        '0x0000000000000000000000000000000000000000'
      )
        createdToken.creator = owner;
      res = await this.createToken(createdToken);
      kollection.tokens.push(res);
    }
    await kollection.save();

    createdEvent.token = res;
    createdEvent.save();

    let userTokens = (await owner.populate('tokens', 'tokenId')).tokens;
    let userToken = userTokens.find((item) => {
      return item.tokenId == transferEvent.returnValues.tokenId;
    });
    if (!userToken) {
      // owner.tokens.push(res);
      userTokens.push(res);
    }
    await owner.save();
  }
  async indexTransfers() {
    console.log('Indexing Transfer ...');
    await this.tokenContract.getPastEvents(
      'Transfer',
      {
        fromBlock: process.env.FROM_BLOCK,
        toBlock: 'latest',
      },
      async (error, events) => {
        for (let i = 0; i < events.length; i++) {
          await this.doListenTransfer(events[i]);
        }
      },
    );
  }
}
