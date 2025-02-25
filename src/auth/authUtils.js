"use strict"
import JWT from "jsonwebtoken";
import {asyncHandler} from "../helpers/asyncHandler.helper.js";
import {HEADERS} from "../constants/index.js";
import {AuthorizedFailRequestError, NotFoundRequestError} from "../middlewares/error.middleware.js";
import keyTokenService from "../services/keyToken/keyToken.service.js";

export const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // Access token
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })
        // refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })
        console.log({
            accessToken,
            refreshToken
        })
        return {
            accessToken,
            refreshToken
        }
    } catch (e) {
        console.log(e)
        throw e
    }
}


export const authenticate = asyncHandler(async (req, res, next) => {
    // Check userid is missing
    const userId = req.headers[HEADERS.CLIENT_ID];
    if (!userId) throw new AuthorizedFailRequestError('Invalid Request');

    // get access token
    const keyStore = await keyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundRequestError('Not Found Key Store');

    // Verify token
    const accessToken = req.headers[HEADERS.AUTHORIZATION];
    if (!accessToken) throw new AuthorizedFailRequestError('Invalid Request');

    // Check user in DB
    try {
        // Check keyStore with this user id
        const decode = JWT.verify(accessToken, keyStore.publicKey);

        if (userId !== decode.userId) throw new AuthorizedFailRequestError('Invalid User')

        req.keyStore = keyStore;
        // Return next
        return next();
    } catch (e) {
        throw e
    }
})

export const authenticateV2 = asyncHandler(async (req, res, next) => {
    // Check userid is missing
    const userId = req.headers[HEADERS.CLIENT_ID];

    if (!userId) throw new AuthorizedFailRequestError('Invalid Request');

    // get access token
    const keyStore = await keyTokenService.findByUserId(userId);
    console.log('keyStore::', keyStore);

    if (!keyStore) throw new NotFoundRequestError('Not Found Key Store');

    const refreshToken = req.headers[HEADERS.REFRESH_TOKEN]
    // Verify token
    if (refreshToken) {
        try {
            // Check keyStore with this user id
            const decode = JWT.verify(refreshToken, keyStore.privateKey);

            if (userId !== decode.userId) throw new AuthorizedFailRequestError('Invalid User')

            req.keyStore = keyStore;
            req.user = decode
            req.refreshToken = refreshToken
            return next();
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    const accessToken = req.headers[HEADERS.AUTHORIZATION];
    if (!accessToken) throw new AuthorizedFailRequestError('Invalid Request');

    // Check user in DB
    try {
        // Check keyStore with this user id
        const decode = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decode._id) throw new AuthorizedFailRequestError('Invalid User')

        req.keyStore = keyStore;
        req.user = decode;
        // Return next
        return next();
    } catch (e) {
        console.log(e)
        throw e
    }
})

export const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}