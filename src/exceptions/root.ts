
export class HttpException extends Error {
    errorCode: ErrorCode;
    statusCode: number;
    error: any;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, error: any) {

        super(message)
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.error = error;

    }
}

export class BadRequestException extends HttpException {

    constructor(message: string, errorCode: ErrorCode, statusCode: number, error: any) {
        super(message, errorCode, 400, error )
    }
}




export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXIST = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 3001,

}