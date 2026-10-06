import bcrypt from "bcrypt";
import { IUser, userFactory } from "../../../entities/user";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { PrismaUserRepository } from "../../../repositories";
import { HttpError } from "../../../../helpers/httpError";
import { signAccessToken } from "../../../../libs/jwt";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    accessToken: string;
    user: IUser;
}

interface IFactoryParams {
    prismaUserRepository: PrismaUserRepository;
}

// Compared against when the email does not exist, so both failure paths take the same time
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10);

export interface IUserAuthUseCase extends IUseCase<IRequest, IResponse> { }

export default function userAuthUseCaseFactory({
    prismaUserRepository
}: IFactoryParams): IUserAuthUseCase {
    return {
        execute: async ({ email, password }) => {
            const user = await prismaUserRepository.findByEmailWithPassword(email.trim().toLowerCase());
            const passwordMatches = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);

            if (!user || !passwordMatches) {
                throw new HttpError("Invalid email or password.", 401);
            }

            const accessToken = await signAccessToken({ userId: user.id });

            return withUseCaseResponse({ accessToken, user: userFactory(user) }, "Authenticated successfully.");
        }
    };
}
