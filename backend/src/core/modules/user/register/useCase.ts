import bcrypt from "bcrypt";
import { IUser } from "../../../entities/user";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { IUserRepository } from "../../../repositories";
import { HttpError } from "../../../../helpers/httpError";
import { DuplicateError } from "../../../../helpers/duplicateError";
import { signAccessToken } from "../../../../libs/jwt";
import { PASSWORD_MIN_LENGTH, REGISTRATION_ENABLED } from "../../../config";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    accessToken: string;
    user: IUser;
}

interface IFactoryParams {
    userRepository: IUserRepository;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MAX_BYTES = 72;

export interface IUserRegisterUseCase extends IUseCase<IRequest, IResponse> { }

export default function userRegisterUseCaseFactory({
    userRepository
}: IFactoryParams): IUserRegisterUseCase {
    return {
        execute: async ({ email, password }) => {
            if (!REGISTRATION_ENABLED) {
                throw new HttpError("Registration is disabled.", 403);
            }

            const normalizedEmail = email.trim().toLowerCase();

            if (!EMAIL_PATTERN.test(normalizedEmail) || normalizedEmail.length > 255) {
                throw new HttpError("Invalid email.", 400);
            }
            if (password.length < PASSWORD_MIN_LENGTH) {
                throw new HttpError(`Password must have at least ${PASSWORD_MIN_LENGTH} characters.`, 400);
            }
            if (Buffer.byteLength(password) > PASSWORD_MAX_BYTES) {
                throw new HttpError(`Password must have at most ${PASSWORD_MAX_BYTES} bytes.`, 400);
            }

            let user: IUser;
            try {
                user = await userRepository.create({
                    email: normalizedEmail,
                    password: await bcrypt.hash(password, 10),
                    userType: "USER",
                });
            } catch (err) {
                if (err instanceof DuplicateError) {
                    throw new HttpError("Email already registered.", 409);
                }
                throw err;
            }

            const accessToken = await signAccessToken({ userId: user.id });

            return withUseCaseResponse({ accessToken, user }, "User registered successfully.");
        }
    };
}
