'use strict'

import mongoose from "mongoose";
import {CONFIG} from "../configs/config.mongoose.js";
const password = 'DQYbDMrTVbPIXUnZ'
const connectString = `mongodb+srv://thuctrinhhong1999:${password}@cluster0.wk2gg.mongodb.net/${CONFIG.mongoose.name}`

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongoose') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true})
        }
        if (type === 'mongoose')
            console.log('outside connect database', CONFIG.mongoose.name)
            mongoose.connect(connectString).then(() => {
                console.log('Connect mongodb successfully')
            }).catch((e) => {
                console.log(`Connect Error`, e)
            })
    }

    static getInstance() {
        if(!Database.instance){
            Database.instance = new Database();
        }

        return Database.instance
    }

}


const handleGetInstanceConnectMongoose = () => {
    return  Database.getInstance();
}
export {
    handleGetInstanceConnectMongoose
}