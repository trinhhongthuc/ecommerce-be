'use strict'

import express from "express";
import AccessController from "../../controllers/access/access.controller.js";
import {asyncHandler} from "../../helpers/asyncHandler.helper.js";
import {permission, apiKey} from "../../auth/checkAuth.js";
import {authenticate, authenticateV2} from "../../auth/authUtils.js";

const router = express.Router();
router.post('/login', asyncHandler(AccessController.login))

router.post('/sign-up', asyncHandler(AccessController.signUp))


// Check api key
router.use(apiKey);
router.use(permission('0000'));
router.use(authenticateV2)
// Authentication
router.post('/logout', asyncHandler(AccessController.logout))
router.post('/handleRefreshToken', asyncHandler(AccessController.handleRefreshToken))


export default router;