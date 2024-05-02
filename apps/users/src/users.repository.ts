import {Injectable, Logger} from "@nestjs/common";
import {AbstractRepository, UserDocument} from "@app/common";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, Model, Types} from "mongoose";


@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument>{
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
        super(userModel);
    }

    async create(document: Omit<UserDocument, '_id'>): Promise<UserDocument> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });

        return (await createdDocument.save()).toJSON() as unknown as UserDocument;
    }

    async findWithPagination(filterQuery: FilterQuery<UserDocument>, skip: number, limit: number) {
        return this.model.find(filterQuery).skip(skip).limit(limit).lean<UserDocument[]>(true);
    }

    async countDocuments(filterQuery: FilterQuery<UserDocument>) {
        return this.model.countDocuments(filterQuery);
    }
}