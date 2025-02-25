"use strict"

import {StatusCodes, getReasonPhrase} from "http-status-codes";

class ErrorMiddleware extends Error {
    constructor(message, status) {
        super(message);
        this.status = status
    }
}

class ConflictRequestError extends ErrorMiddleware {
    constructor(message = getReasonPhrase(StatusCodes.CONFLICT)
        , statusCode = StatusCodes.CONFLICT) {
        super(message, statusCode);
    }
}


class BadRequestError extends ErrorMiddleware {
    constructor(message = getReasonPhrase(StatusCodes.BAD_REQUEST)
        , statusCode = StatusCodes.BAD_REQUEST) {
        super(message, statusCode);
    }
}

class UnAuthorizedRequestError extends ErrorMiddleware {
    constructor(message = getReasonPhrase(StatusCodes.UNAUTHORIZED)
        , statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class AuthorizedFailRequestError extends ErrorMiddleware {
    constructor(message = getReasonPhrase(StatusCodes.UNAUTHORIZED)
        , statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class NotFoundRequestError extends ErrorMiddleware {
    constructor(message = getReasonPhrase(StatusCodes.NOT_FOUND)
        , statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}

class ForbiddenRequestError extends ErrorMiddleware {
    constructor(message = getReasonPhrase(StatusCodes.FORBIDDEN)
        , statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

export {
    BadRequestError,
    NotFoundRequestError,
    ConflictRequestError,
    ForbiddenRequestError,
    UnAuthorizedRequestError,
    AuthorizedFailRequestError,
}