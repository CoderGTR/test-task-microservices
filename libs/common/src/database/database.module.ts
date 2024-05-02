import { Module } from '@nestjs/common';
import {ModelDefinition, MongooseModule} from "@nestjs/mongoose";
import {ConfigService} from "@nestjs/config";
import * as autoIncrement from 'mongoose-auto-increment';
import {connection} from "mongoose";
// import * as Joi from 'joi';

@Module({
    imports: [MongooseModule.forRootAsync({
        useFactory: (configService: ConfigService) => ({
            uri: configService.get('MONGODB_URI'),
        }),
        inject: [ConfigService],
    })],
})
export class DatabaseModule {
    static forFeature(models: ModelDefinition[]) {
        return MongooseModule.forFeature(models);
    }
}
