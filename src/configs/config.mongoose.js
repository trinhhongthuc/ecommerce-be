import dotenv from 'dotenv';


dotenv.config()

const dev = {
    app: {
        port: process.env.DEV_APP_PORT
    },
    mongoose: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME
    }
}

const prod = {
    app: {
        port: process.env.PROD_APP_PORT
    },
    mongoose: {
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        name: process.env.PROD_DB_NAME
    }
}

const envType = process.env.NODE_ENV_TYPE || 'dev';

const CONFIG = {dev, prod}[envType];

export {
    CONFIG
}
