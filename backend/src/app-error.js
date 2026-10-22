export class AppError extends Error {
    constructor(statusCode = 500, message = "An unexpected error occured", errorCode) {
        super(message)

        this.statusCode = statusCode
        this.message = message
        this.errorCode = errorCode
        this.name = this.constructor.name
        
        Error.captureStackTrace(this, this.constructor);
    }
}