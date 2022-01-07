import {
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { Token, TokenDocument } from './token.model';
import * as NFT from '../contracts/NFT.json';
import { KollectionService } from '../kollection/kollection.service';
import { User } from '../user/user.model';
import { Kollection } from '../kollection/kollection.model';

@Injectable()
export class TokenService {
  private provider: ethers.providers.WebSocketProvider;
  private tokenContract: ethers.Contract;

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private userService: UserService,
    private kollectionService: KollectionService
  ) {}
  
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

  async listen() {
    this.provider = new ethers.providers.WebSocketProvider(
      'http://127.0.0.1:8545',
    );
    this.tokenContract = new ethers.Contract(
      process.env.RONIA_NFT,
      NFT.abi,
      this.provider,
    );

    console.log('listening on transfers started...');
    this.tokenContract.on('Transfer', async (from, to, tokenId) => {
      console.log('transfer created on tokenId: ' + tokenId.toNumber());
      console.log('from: ' + from);
      console.log('to: ' + to);
      let tokenUri = await this.tokenContract.tokenURI(tokenId.toNumber());
      console.log(tokenUri);

      let kollection = await this.kollectionService.findOrCreateByContract(process.env.RONIA_NFT);
      console.log("kollection: " + kollection)
      let owner = await this.userService.findOrCreateByAddress(to)
      console.log("owner: " + owner)
      let kollectionTokens = (await kollection.populate('tokens', 'tokenId')).tokens
      let kollectionToken = kollectionTokens.find(item => {
        return item.tokenId == tokenId.toNumber()
      })
      if(kollectionToken){
        kollectionToken.owner = owner
        var res = kollectionToken
      } else{
        let createdToken: Token = new Token();
        createdToken.tokenId = tokenId.toNumber();
        createdToken.owner = owner;
        createdToken.kollection = kollection;
        createdToken.tokenUri = tokenUri;
        res = await this.createToken(createdToken)
        kollection.tokens.push(res)
      }
      await kollection.save()
      
      let formerOwner = await this.userService.findOrCreateByAddress(from)
      let formerOwnerTokens = (await formerOwner.populate('tokens', 'tokenId')).tokens
      let formerOwnerToken = formerOwnerTokens.find(item => {
        return item.tokenId == tokenId.toNumber()
      })
      if(formerOwnerToken){
        formerOwnerTokens.splice(formerOwnerTokens.indexOf(formerOwnerToken), 1);
      }
      await formerOwner.save()


      let userTokens = (await owner.populate('tokens', 'tokenId')).tokens
      let userToken = userTokens.find(item => {
        return item.tokenId == tokenId.toNumber()
      })
      console.log("userToken: " + userToken)
      if(!userToken){
        // owner.tokens.push(res);
        userTokens.push(res);
      }
      await owner.save()
    });
  }
}
