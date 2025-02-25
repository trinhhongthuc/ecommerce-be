import crypto from "crypto";
import KeyTokenService from "../services/keyToken/keyToken.service.js";
import {createTokenPair} from "../auth/authUtils.js";

const createTokensUtilTs = async ({payload, refreshToken}) => {
    const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    })

    const {publicKeyString} = await KeyTokenService.createKeyToken({
        userId: payload._id,
        publicKey,
        privateKey,
        refreshToken
    });

    if (!publicKeyString) {
        return {
            code: 'xxx',
            message: "publicKey Error"
        }
    }

    const tokens =  await createTokenPair(payload, publicKeyString, privateKey);

    return {
        privateKey,
        publicKey,
        tokens
    }
}

export default createTokensUtilTs