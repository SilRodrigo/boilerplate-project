export class DuplicateError extends Error {
    constructor(public fields: string[] = []) {
        super(`Duplicate value${fields.length ? ` for ${fields.join(', ')}` : ''}.`);
        this.name = 'DuplicateError';
    }
}
