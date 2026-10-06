import bcrypt from "bcrypt";

jest.mock("../../../config", () => ({
    JWT_SECRET: "test-secret",
    JWT_EXPIRES_IN: "1h",
}));

import userAuthUseCaseFactory from "./useCase";
import { verifyAccessToken } from "../../../../libs/jwt";

const makeUser = async (password: string) => ({
    id: "user-id",
    email: "admin@example.com",
    password: await bcrypt.hash(password, 4),
    userType: "ADMIN" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
});

const makeSut = (user: Awaited<ReturnType<typeof makeUser>> | null) => {
    const prismaUserRepository = {
        findByEmailWithPassword: jest.fn().mockResolvedValue(user),
    };

    const useCase = userAuthUseCaseFactory({ prismaUserRepository: prismaUserRepository as any });

    return { useCase, prismaUserRepository };
};

describe("userAuthUseCase", () => {
    it("returns a token and the user without the password hash", async () => {
        const { useCase, prismaUserRepository } = makeSut(await makeUser("secret"));

        const { data } = await useCase.execute({ email: " Admin@Example.com ", password: "secret" });

        expect(prismaUserRepository.findByEmailWithPassword).toHaveBeenCalledWith("admin@example.com");
        expect(data?.user).toEqual(expect.objectContaining({ id: "user-id", userType: "ADMIN" }));
        expect(data?.user).not.toHaveProperty("password");
        await expect(verifyAccessToken(data!.accessToken)).resolves.toEqual({ userId: "user-id" });
    });

    it("rejects a wrong password with 401", async () => {
        const { useCase } = makeSut(await makeUser("secret"));

        await expect(useCase.execute({ email: "admin@example.com", password: "wrong" }))
            .rejects.toMatchObject({ status: 401, message: "Invalid email or password." });
    });

    it("rejects an unknown email with the same 401 error", async () => {
        const { useCase } = makeSut(null);

        await expect(useCase.execute({ email: "nobody@example.com", password: "secret" }))
            .rejects.toMatchObject({ status: 401, message: "Invalid email or password." });
    });
});
