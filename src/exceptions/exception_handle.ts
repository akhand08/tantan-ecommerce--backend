import { ErrorCode, HttpException } from "./root";


export class InternalException extends HttpException {

    constructor(message: string, errorCode: ErrorCode,  error: any) {
        super(message, errorCode, 500, error )
    }
}


export class BadRequestException extends HttpException {

    constructor(message: string, errorCode: ErrorCode,  error: any) {
        super(message, errorCode, 400, error )
    }
}

export class NotFoundException extends HttpException {

    constructor(message: string, errorCode: ErrorCode,  error: any) {
        super(message, errorCode, 404, error )
    }
}

export class UnprocessableEntity extends HttpException {

    constructor(message: string, errorCode: ErrorCode,  error: any) {
        super(message, errorCode, 400, error )
    }
}


export class UnauthorizedException extends HttpException {

    constructor(message: string, errorCode: ErrorCode,  error: any) {
        super(message, errorCode, 401, error )
    }
}