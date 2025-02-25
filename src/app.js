import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import {handleGetInstanceConnectMongoose} from "./dbs/init.mongodb.js";
import {checkOverload, countConnect} from "./helpers/check.connect.js";
import routers from "./routers/index.js";
import apiKeyModel from "./models/apiKey.model.js";

const app = express();
// Init Middleware
app.use(morgan('dev')); // log net word
app.use(helmet()); // Block show library
app.use(compression()); // Giảm kích thước mã tệp
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
// Init DB
handleGetInstanceConnectMongoose()
// countConnect();
checkOverload();

// Init Routers

app.use('/', routers)
// Handle Errors

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status= 404;
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status ?? 500;

    return res.status(statusCode).json({
        status: 'Error',
        code: statusCode,
        message: error.message ?? 'Internal Server Error'
    })
})


export default app;