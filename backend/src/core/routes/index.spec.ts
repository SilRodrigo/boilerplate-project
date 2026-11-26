jest.mock("../config", () => ({
    JWT_SECRET: "test-secret",
    JWT_EXPIRES_IN: "1h",
    AUTH_RATE_LIMIT_MAX: 10,
    REGISTER_RATE_LIMIT_MAX: 5,
}));

import { loadRouteModules } from ".";

describe("loadRouteModules", () => {
    it("mounts every *.routes file at /<name> without a central list", () => {
        const mounted = loadRouteModules().map(({ file, path }) => ({ file, path }));

        expect(mounted).toEqual(expect.arrayContaining([
            { file: "example.routes.ts", path: "/example" },
            { file: "user.routes.ts", path: "/user" },
        ]));
    });
});
