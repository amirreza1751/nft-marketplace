import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Erc20, Erc20Model } from './erc20.model';
import { Erc20Service } from './erc20.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Erc20.name, schema: Erc20Model }], 'ronia'),
  ],
  providers: [Erc20Service],
  exports: [
    Erc20Service
  ]
})
export class Erc20Module {}
