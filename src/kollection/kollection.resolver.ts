import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Token } from 'graphql';
import { TokenService } from '../token/token.service';
import { FindKollectionInput, Kollection } from './kollection.model';
import { KollectionService } from './kollection.service';

@Resolver(() => Kollection)
export class KollectionResolver {
    
    constructor(
        private kollectionService: KollectionService,
        private tokenService: TokenService
    ){}

    @Query(() => [Kollection])
    async kollections(){
        return this.kollectionService.findMany()
    }

    @Query(() => Kollection)
    async kollection(@Args('input') {_id}: FindKollectionInput){
        return this.kollectionService.findById(_id)
    }

    @ResolveField()
    async tokens(@Parent() _kollection: Kollection){
        return this.tokenService.findMany({kollection: _kollection})
    }
}
