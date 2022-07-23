export class MyError extends Error {
    message: string
    status: number

    constructor(message: string, status?: number) {
        super(message);
        Object.setPrototypeOf(this, Error)
        this.message = message;
        this.status = status ?? 500;
    }
}