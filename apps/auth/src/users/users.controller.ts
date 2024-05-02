import {Body, Controller, Delete, Get, HttpCode, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {CurrentUser} from "@app/common/decorators/current-user.decorator";
import {UserDocument} from "@app/common";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UserResponseDto} from "./dto/user-response.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {

    }
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getUser(
        @CurrentUser() user: UserDocument,
    ){
        return new UserResponseDto(user);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @Body() updateUserDto: UpdateUserDto,
    ){
        return this.usersService.updateUser(updateUserDto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteUser(
        @CurrentUser() user: UserDocument,
    ) {
        return this.usersService.deleteUser(user._id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ){
        return this.usersService.getUsers(page, limit);
    }

    @Get('/httpHealth')
    @HttpCode(200)
    checkHealth() {
        return { status: 'up' };
    }
}
