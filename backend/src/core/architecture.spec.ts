import fs from "fs";
import path from "path";

const listFiles = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? listFiles(full) : full.endsWith(".ts") ? [full] : [];
    });

const PRISMA_IMPORT = /from\s+["']@prisma\/client["']|implementations\/prisma/;

describe("architecture", () => {
    it.each([
        ["core/modules", path.join(__dirname, "modules")],
        ["middlewares", path.join(__dirname, "..", "middlewares")],
    ])("%s depends only on repository interfaces, never on Prisma", (_label, dir) => {
        const offenders = listFiles(dir)
            .filter((file) => PRISMA_IMPORT.test(fs.readFileSync(file, "utf-8")))
            .map((file) => path.relative(__dirname, file));

        expect(offenders).toEqual([]);
    });
});
