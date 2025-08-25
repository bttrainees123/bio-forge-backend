class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends CustomError {
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}

class BadRequestError extends CustomError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden') {
        super(message, 200);
    }
}

class NotFoundError extends CustomError {
    constructor(message = 'Resource not found') {
        super(message, 200);
    }
}

class ConflictError extends CustomError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

class UnprocessableEntityError extends CustomError {
    constructor(message = 'Unprocessable entity') {
        super(message, 422);
    }
}

class TooManyRequestsError extends CustomError {
    constructor(message = 'Too many requests') {
        super(message, 429);
    }
}

class InternalServerError extends CustomError {
    constructor(message = 'Internal server error') {
        super(message, 500);
    }
}

class NotImplementedError extends CustomError {
    constructor(message = 'Not implemented') {
        super(message, 501);
    }
}

class ServiceUnavailableError extends CustomError {
    constructor(message = 'Service unavailable') {
        super(message, 503);
    }
}

class DatabaseError extends CustomError {
    constructor(message = 'Database error') {
        super(message, 500);
    }
}

class DuplicateKeyError extends CustomError {
    constructor(message = 'Duplicate key error') {
        super(message, 409);
    }
}

class CastError extends CustomError {
    constructor(message = 'Invalid data format') {
        super(message, 400);
    }
}

class TokenExpiredError extends CustomError {
    constructor(message = 'Token has expired') {
        super(message, 401);
    }
}

class InvalidTokenError extends CustomError {
    constructor(message = 'Invalid token') {
        super(message, 401);
    }
}

class AccountBlockedError extends CustomError {
    constructor(message = 'Account is blocked') {
        super(message, 403);
    }
}

class AccountDeletedError extends CustomError {
    constructor(message = 'Account is deleted') {
        super(message, 403);
    }
}

class FileUploadError extends CustomError {
    constructor(message = 'File upload failed') {
        super(message, 400);
    }
}

class FileSizeError extends CustomError {
    constructor(message = 'File size exceeds limit') {
        super(message, 413);
    }
}

class FileTypeError extends CustomError {
    constructor(message = 'Invalid file type') {
        super(message, 415);
    }
}

class RateLimitError extends CustomError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429);
    }
}

class PaymentError extends CustomError {
    constructor(message = 'Payment failed') {
        super(message, 402);
    }
}

class InsufficientFundsError extends CustomError {
    constructor(message = 'Insufficient funds') {
        super(message, 402);
    }
}

class NetworkError extends CustomError {
    constructor(message = 'Network error') {
        super(message, 503);
    }
}

class TimeoutError extends CustomError {
    constructor(message = 'Request timeout') {
        super(message, 408);
    }
}

class BusinessLogicError extends CustomError {
    constructor(message = 'Business logic error') {
        super(message, 422);
    }
}

class PermissionDeniedError extends CustomError {
    constructor(message = 'Permission denied') {
        super(message, 403);
    }
}

class ResourceLimitError extends CustomError {
    constructor(message = 'Resource limit exceeded') {
        super(message, 429);
    }
}

module.exports = {
    // Base error
    CustomError,

    // HTTP status based errors
    ValidationError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    UnprocessableEntityError,
    TooManyRequestsError,
    InternalServerError,
    NotImplementedError,
    ServiceUnavailableError,

    // Database errors
    DatabaseError,
    DuplicateKeyError,
    CastError,

    // Authentication errors
    TokenExpiredError,
    InvalidTokenError,
    AccountBlockedError,
    AccountDeletedError,

    // File upload errors
    FileUploadError,
    FileSizeError,
    FileTypeError,

    // Rate limiting
    RateLimitError,

    // Payment errors
    PaymentError,
    InsufficientFundsError,

    // Network errors
    NetworkError,
    TimeoutError,

    // Business logic errors
    BusinessLogicError,
    PermissionDeniedError,
    ResourceLimitError
};
