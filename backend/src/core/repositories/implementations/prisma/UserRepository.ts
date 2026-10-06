import { IUser, userFactory } from "../../../entities/user";
import { ICreateUserDto, IRequestUserDto, IUpdateUserDto, IIncludeUserDto } from "../../../dtos";
import { PrismaBaseRepository } from "./abstract/BaseRepository";

const INDEX_KEY = 'user' as const;

export default class PrismaUserRepository extends PrismaBaseRepository<
    typeof INDEX_KEY,
    IIncludeUserDto,
    IUser,
    ICreateUserDto,
    IRequestUserDto,
    IUpdateUserDto> {

    constructor() {
        const include = {}

        super(INDEX_KEY, userFactory, include)
    }

    /** Returns the raw record, including the password hash. Use only for authentication. */
    async findByEmailWithPassword(email: string): Promise<IRequestUserDto | null> {
        return this.repository.findUnique({ where: { email } });
    }
}
