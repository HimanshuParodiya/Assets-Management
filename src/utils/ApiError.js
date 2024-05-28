class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = []) {
        super(message);
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false // because this class is for error
        this.errors = errors

        if (stack) {
            this.stack = stack

        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export default ApiError