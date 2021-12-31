import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}
    @Post()
    async createUser(@Body()user: User){
        return this.userService.createUser(user)
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string ,@Body()user: User){
        return this.userService.updateUser(id, user)
    }
}
