import { Prisma } from "@prisma/client";

let mockRegistrationEnabled = true;

// jest.mock is hoisted above the variable, so the flag is read lazily through a getter
jest.mock("../../../config", () => ({
    JWT_SECRET: "test-secret",
    JWT_EXPIRES_IN: "1h",
    PASSWORD_MIN_LENGTH: 8,
    get REGISTRATION_ENABLED() { return mockRegistrationEnabled; },
}));

import bcrypt from "bcrypt";
import userRegisterUseCaseFactory from "./useCase";
import { verifyAccessToken } from "../../../../libs/jwt";

const makeSut = () => {
    const prismaUserRepository = {
        create: jest.fn().mockImplementation(async (data) => ({
            id: "new-user-id",
            email: data.email,
            userType: data.userType,
            createdAt: new Date(),
            updatedAt: new Date(),
        })),
    };

    const useCase = userRegisterUseCaseFactory({ prismaUserRepository: prismaUserRepository as any });

    return { useCase, prismaUserRepository };
};

describe("userRegisterUseCase", () => {
    beforeEach(() => {
        mockRegistrationEnabled = true;
    });

    it("creates a USER with a hashed password and returns a token", async () => {
        const { useCase, prismaUserRepository } = makeSut();

        const { data } = await useCase.execute({ email: " New@Example.com ", password: "long-enough" });

        const created = prismaUserRepository.create.mock.calls[0][0];
        expect(created.email).toBe("new@example.com");
        expect(created.userType).toBe("USER");
        expect(created.password).not.toBe("long-enough");
        await expect(bcrypt.compare("long-enough", created.password)).resolves.toBe(true);

        expect(data?.user).toEqual(expect.objectContaining({ id: "new-user-id", userType: "USER" }));
        await expect(verifyAccessToken(data!.accessToken)).resolves.toEqual({ userId: "new-user-id" });
    });

    it("refuses with 403 when registration is disabled", async () => {
        mockRegistrationEnabled = false;
        const { useCase, prismaUserRepository } = makeSut();

        await expect(useCase.execute({ email: "new@example.com", password: "long-enough" }))
            .rejects.toMatchObject({ status: 403 });
        expect(prismaUserRepository.create).not.toHaveBeenCalled();
    });

    it.each([
        ["an invalid email", "not-an-email", "long-enough"],
        ["a short password", "new@example.com", "short"],
        ["a password over 72 bytes", "new@example.com", "x".repeat(73)],
    ])("rejects %s with 400", async (_label, email, password) => {
        const { useCase, prismaUserRepository } = makeSut();

        await expect(useCase.execute({ email, password })).rejects.toMatchObject({ status: 400 });
        expect(prismaUserRepository.create).not.toHaveBeenCalled();
    });

    it("answers 409 when the email is already registered", async () => {
        const { useCase, prismaUserRepository } = makeSut();
        prismaUserRepository.create.mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError("Unique constraint failed", { code: "P2002", clientVersion: "test" })
        );

        await expect(useCase.execute({ email: "taken@example.com", password: "long-enough" }))
            .rejects.toMatchObject({ status: 409, message: "Email already registered." });
    });
});
