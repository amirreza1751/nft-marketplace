import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Token } from '../token/token.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { Event, FindEventInput } from './event.model';
import { EventService } from './event.service';

@Resolver(() => Event)
export class EventResolver {
    constructor(
        private eventService: EventService,
        private tokenService: TokenService,
        private userService: UserService
    ){}

    @Query(() => [Event])
    async events(){
        return this.eventService.findMany()
    }

    @Query(() => Event)
    async event(@Args('input') {_id}: FindEventInput){
        return this.eventService.findById(_id)
    }

    @ResolveField(() => Token)
    async token(@Parent() event: Event) {
        return this.tokenService.findById(event.token);
    }

    @ResolveField(() => User)
    async from(@Parent() event: Event) {
        return this.userService.findById(event.from);
    }

    @ResolveField(() => User)
    async to(@Parent() event: Event) {
        return this.userService.findById(event.to);
    }
}
