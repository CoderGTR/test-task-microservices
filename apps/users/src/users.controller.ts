import {Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {

    }
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get('/:id')
    async getUser(
        @Param('id') id: string,
    ){
        return this.usersService.getUser({id});
    }

    @Patch('/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ){
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete('/:id')
    async deleteUser(
        @Param('id') id: string,
    ) {
        return this.usersService.deleteUser(id);
    }

    @Get()
    async getUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ){
        return this.usersService.getUsers(page, limit);
    }

    @Get('/health/httpHealth')
    @HttpCode(200)
    checkHealth() {
        return { status: 'up' };
    }
}
