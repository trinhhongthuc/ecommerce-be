'use strict'

import AccessService from "../../services/access/access.service.js";
import {CREATED, OK} from "../../middlewares/success.middlewar.js";

class AccessController {
    signUp = async (req, res, next) => {
        console.log(res.body)
        new CREATED({
            message: 'Registered Ok!',
            metadata: await AccessService.signUp(req.body),
            options:{
                limit: 100
            }
        }).send(res);
    }

    login = async (req, res, next) => {
        new OK({
            message: 'login Ok!',
            metadata: await AccessService.login(req.body),
            options:{
                limit: 100
            }
        }).send(res);
    }


    logout = async (req, res, next) => {
        console.log('req', req.keyStore)
        new OK({
            message: 'login Ok!',
            metadata: await AccessService.logout( req.keyStore ),
            options:{
                limit: 100
            }
        }).send(res);
    }

    handleRefreshToken = async (req, res, next) => {
        console.log('req', req.keyStore)
        new OK({
            message: 'Get Tokens success!',
            metadata: await AccessService.handleRefreshToken( req.body.refreshToken ),
            options:{
                limit: 100
            }
        }).send(res);
    }

}


export default new AccessController();