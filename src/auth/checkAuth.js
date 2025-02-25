"use strict"
import {findById} from "../services/apiKey/apiKey.service.js";
import KeyTokenService from "../services/keyToken/keyToken.service.js";

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();

        if (!key) {
            return res.status(403).json({
                message: 'Forbidden error',
            })
        }

        // check obj key;

        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden error',
            })
        }

        req.objKey = objKey;

        return next();
    } catch (e) {

    }
}


const permission = (permission) => {
    return (req, res, next) => {
        const permissions = req.objKey.permissions
        if (!permissions) {
            return res.status(403).json({
                message: 'Permission denied',
            })
        }

        const isValidPermission = req.objKey.permissions.includes(permission);

        if (!isValidPermission) return res.status(403).json({
            message: 'Permission denied',
        })
        req.keyStore = req.objKey;
        return next()
    }
};

export {apiKey, permission};