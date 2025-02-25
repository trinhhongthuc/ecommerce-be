'use strict'

import keyTokenModel from "../../models/keytoken.model.js";
import {Types} from "mongoose";

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            const publicKeyString = publicKey.toString();
            const filter = {
                user: userId
            }

            const update = {
                publicKey: publicKeyString, privateKey, refreshTokenUsed: [], refreshToken
            };

            const options = {
                upsert: true
            }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return {
                tokens, publicKeyString
            }
        } catch (error) {
            return error;
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({user: userId}).lean();
    }

    static removeById = async (id) => {
        return keyTokenModel.deleteOne(id);
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return keyTokenModel.findOne({
            refreshTokensUsed: refreshToken
        }).lean();
    }

    static findByRefreshToken = async (refreshToken) => {
        return keyTokenModel.findOne({
            refreshToken
        });
    }

    static deleteKeyById = async (userId) => {
        return keyTokenModel.deleteOne({user: userId});
    }

    static updateRefreshTokenUsedById = async ({id, refreshToken, refreshTokenUsed}) => {
        const filter = {_id: id};
        const updateDocument = {
            $set: {
                refreshToken: refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshTokenUsed
            }
        };
        return keyTokenModel.updateOne(filter, updateDocument);

    }
}

export default KeyTokenService;