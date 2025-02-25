"use strict"

import {getReasonPhrase, StatusCodes} from "http-status-codes";

class SuccessResponse {
    constructor({
                    message,
                    statusCode = StatusCodes.OK,
                    reasonStatusCode = getReasonPhrase(StatusCodes.OK),
                    metadata = {}
                }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata});
    }

}

class CREATED extends SuccessResponse {
    constructor({
                    message,
                    statusCode = StatusCodes.CREATED,
                    reasonStatusCode = getReasonPhrase(StatusCodes.CREATED),
                    metadata,
                    options
                }) {
        super({message, statusCode, reasonStatusCode, metadata});
        this.options = options
    }
}

export {
    OK, CREATED
}