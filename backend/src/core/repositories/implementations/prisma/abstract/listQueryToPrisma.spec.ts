import { toPrismaOrderBy, toPrismaWhere } from "./listQueryToPrisma";

describe("toPrismaWhere", () => {
    it("turns a plain value into equals", () => {
        expect(toPrismaWhere({ done: true })).toEqual({ done: { equals: true } });
    });

    it("keeps known operators and drops anything else", () => {
        const filter = { name: { contains: "foo", mode: "insensitive", OR: [1] } } as any;

        expect(toPrismaWhere(filter)).toEqual({ name: { contains: "foo", mode: "insensitive" } });
    });

    it("skips fields left without any known operator", () => {
        expect(toPrismaWhere({ name: { unknown: 1 } } as any)).toEqual({});
    });

    it("returns an empty where for no filter", () => {
        expect(toPrismaWhere()).toEqual({});
    });
});

describe("toPrismaOrderBy", () => {
    it("keeps the field order as a list", () => {
        expect(toPrismaOrderBy({ createdAt: "desc", name: "asc" })).toEqual([{ createdAt: "desc" }, { name: "asc" }]);
    });

    it("drops invalid directions", () => {
        expect(toPrismaOrderBy({ name: "up" } as any)).toEqual([]);
    });
});
