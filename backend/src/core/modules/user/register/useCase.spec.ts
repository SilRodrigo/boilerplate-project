let mockRegistrationEnabled = true;

jest.mock("../../../config", () => ({
    JWT_SECRET: "test-secret",
    JWT_EXPIRES_IN: "1h",
    PASSWORD_MIN_LENGTH: 8,
    get REGISTRATION_ENABLED() { return mockRegistrationEnabled; },
}));

import bcrypt from "bcrypt";
import userRegisterUseCaseFactory from "./useCase";
import { verifyAccessToken } from "../../../../libs/jwt";
import { DuplicateError } from "../../../../helpers/duplicateError";

const makeSut = () => {
    const userRepository = {
        create: jest.fn().mockImplementation(async (data) => ({
            id: "new-user-id",
            email: data.email,
            userType: data.userType,
            createdAt: new Date(),
            updatedAt: new Date(),
        })),
    };

    const useCase = userRegisterUseCaseFactory({ userRepository: userRepository as any });

    return { useCase, userRepository };
};

describe("userRegisterUseCase", () => {
    beforeEach(() => {
        mockRegistrationEnabled = true;
    });

    it("creates a USER with a hashed password and returns a token", async () => {
        const { useCase, userRepository } = makeSut();

        const { data } = await useCase.execute({ email: " New@Example.com ", password: "long-enough" });

        const created = userRepository.create.mock.calls[0][0];
        expect(created.email).toBe("new@example.com");
        expect(created.userType).toBe("USER");
        expect(created.password).not.toBe("long-enough");
        await expect(bcrypt.compare("long-enough", created.password)).resolves.toBe(true);

        expect(data?.user).toEqual(expect.objectContaining({ id: "new-user-id", userType: "USER" }));
        await expect(verifyAccessToken(data!.accessToken)).resolves.toEqual({ userId: "new-user-id" });
    });

    it("refuses with 403 when registration is disabled", async () => {
        mockRegistrationEnabled = false;
        const { useCase, userRepository } = makeSut();

        await expect(useCase.execute({ email: "new@example.com", password: "long-enough" }))
            .rejects.toMatchObject({ status: 403 });
        expect(userRepository.create).not.toHaveBeenCalled();
    });

    it.each([
        ["an invalid email", "not-an-email", "long-enough"],
        ["a short password", "new@example.com", "short"],
        ["a password over 72 bytes", "new@example.com", "x".repeat(73)],
    ])("rejects %s with 400", async (_label, email, password) => {
        const { useCase, userRepository } = makeSut();

        await expect(useCase.execute({ email, password })).rejects.toMatchObject({ status: 400 });
        expect(userRepository.create).not.toHaveBeenCalled();
    });

    it("answers 409 when the email is already registered", async () => {
        const { useCase, userRepository } = makeSut();
        userRepository.create.mockRejectedValue(new DuplicateError(["email"]));

        await expect(useCase.execute({ email: "taken@example.com", password: "long-enough" }))
            .rejects.toMatchObject({ status: 409, message: "Email already registered." });
    });
});
