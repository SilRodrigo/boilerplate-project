/** Error carrying an HTTP status, picked up by errorResponse. */
export class HttpError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.name = 'HttpError';
    }
}
