'use strict'

import shopModel from "../../models/shop.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto"
import KeyTokenService from "../keyToken/keyToken.service.js";
import {createTokenPair, verifyJWT} from "../../auth/authUtils.js";
import {getInfoData} from "../../utils/index.ts.js";
import {
    AuthorizedFailRequestError,
    BadRequestError,
    ConflictRequestError,
    ForbiddenRequestError,
    UnAuthorizedRequestError
} from "../../middlewares/error.middleware.js";
import ShopService from "../shop/shop.service.js";
import createTokensUtilTs from "../../utils/createTokens.util.ts.js";
import {HEADERS} from "../../constants/index.js";
import keyTokenService from "../keyToken/keyToken.service.js";

export const SAT = 10;

const RolesShop = {
    SHOP: 0,
    WRITER: 1
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        // Step1 check email exist
        const holderShop = await shopModel.findOne({email}).lean();
        if (holderShop) throw new BadRequestError('Error: Shop already registered')
        const hashPassword = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            email, name, password: hashPassword, roles: [RolesShop.SHOP]
        })

        if (newShop) {
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
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: ''
            });

            if (!publicKeyString) {
                return {
                    code: 'xxx',
                    message: "publicKey Error"
                }
            }

            const publicKeyObject = crypto.createPublicKey(publicKeyString);

            const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyString, privateKey)

            return {
                shop: getInfoData({
                    fields: ['name', '_id', 'email'],
                    object: newShop
                }),
                tokens
            }
        }

        return {
            code: 201,
            metadata: null
        }
    }

    // Check email
    // Match  password
    // Create access token, refresh token
    // general tokens
    // get data return login
    static login = async ({refreshToken, email, password}) => {
        const foundShop = await ShopService.findByEmail({email});

        if (!foundShop) throw new BadRequestError('Shop not registered!');
        const matchPassword = bcrypt.compare(password, foundShop.password);

        if (!matchPassword) throw new UnAuthorizedRequestError('Authenticate Error');
        //Create Tokens
        const {tokens, publicKey, privateKey} = await createTokensUtilTs({payload: getInfoData({
                fields: ['email', 'name', '_id'],
                object: foundShop
            }), refreshToken})

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })

        return {
            shop: getInfoData({
                fields: ['name', 'email', '_id'],
                object: foundShop
            }),
            tokens
        }
    }

    static logout = async ({_id}) => {
        return await keyTokenService.removeById(_id);
    }

    static handleRefreshToken = async (refreshToken) => {
        // Check this token
        const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            // decode Token check user use
            const decode= await verifyJWT(refreshToken, foundToken.privateKey);
                console.log(decode)
            await keyTokenService.deleteKeyById(decode._id);
            throw new ForbiddenRequestError('Something wrong, Pleaser Login!')
        }

        const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) throw new AuthorizedFailRequestError('Show not registered 1');
        const decodeToken = await verifyJWT(refreshToken, holderToken.privateKey);


        const foundShop = await ShopService.findByEmail({email: decodeToken.email.trim()});

        if (!foundShop) throw new AuthorizedFailRequestError('Show not registered 2');

        // create 2 token
        const tokens = await createTokenPair({userId: foundShop._id, email: decodeToken?.email}, holderToken.publicKey, holderToken.privateKey)

        // update token
        await keyTokenService.updateRefreshTokenUsedById({
            id: holderToken._id,
            refreshToken: tokens.refreshToken,
            refreshTokenUsed: refreshToken
        })

        return {
            user: getInfoData({
                fields: ['email', '_id'], object: foundShop
            }),
            tokens
        }
    }
}

export default AccessService;