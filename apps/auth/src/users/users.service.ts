import {Inject, Injectable, UnauthorizedException, UnprocessableEntityException} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersRepository} from "./users.repository";
import {GetUserDto} from "./dto/get-user.dto";
import {UserResponseDto} from "./dto/user-response.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {Types} from "mongoose";
import {NOTIFICATIONS_SERVICE} from "@app/common";
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class UsersService {
    constructor(
        private  readonly usersRepository: UsersRepository,

        @Inject(NOTIFICATIONS_SERVICE)
        private readonly notificationsService: ClientProxy
    ) {
    }

    async create(createUserDto: CreateUserDto) {
        await this.validateUserDto(createUserDto);
        const user = await this.usersRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
        });

        this.notificationsService.emit('notify_email', { email: user.email, text: `User with email ${user.email} has been created!` });

        return new UserResponseDto(user);
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw new UnauthorizedException('Credentials are not valid.');
        }
        return user;
    }

    async getUser(getUserDto: GetUserDto) {
        return this.usersRepository.findOne(getUserDto);
    }

    private async validateUserDto(userDto: CreateUserDto|UpdateUserDto) {
        try {
            await this.usersRepository.findOne({ email: userDto.email });
        } catch (err) {
            return;
        }
        throw new UnprocessableEntityException('Email already exists.');
    }

    async updateUser(user: UpdateUserDto){
        await this.validateUserDto(user);
        const updatedUser = await this.usersRepository.findOneAndUpdate({_id: user._id}, {$set: user});

        return new UserResponseDto(updatedUser);
    }

    async deleteUser(userId: Types.ObjectId) {
        const user = await this.usersRepository.findOneAndDelete({ _id: userId });

        this.notificationsService.emit(
            'notify_email',
            {
                    email: user.email, text: `User with email ${user.email} has been DELETED!`,
                },
            );

        return new UserResponseDto(user);
    }

    async getUsers(page: number, limit: number) {
        const skippedItems = (page - 1) * limit;

        const users = await this.usersRepository.findWithPagination({}, skippedItems, limit);
        const total = await this.usersRepository.countDocuments({});

        return {
            data: users.map(user => new UserResponseDto(user)),
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };

    }
}
