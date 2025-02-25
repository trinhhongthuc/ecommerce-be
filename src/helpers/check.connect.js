'use strict'

import mongoose from "mongoose";
import * as os from "node:os";

const TIMER_CHECK_OVERLOAD = 5000;

const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log('Num connection: ', numConnection);

    return numConnection;
}

const checkOverload = () => {
    // setInterval(() => {
    //     const numConnection = countConnect();
    //     const numCores = os.cpus().length;
    //     const memoryUsage = process.memoryUsage().rss;
    //     // Example max connection is 5;
    //
    //     const maxConnection = numCores * 5;
    //     console.log('Active connection: ', numConnection);
    //     console.log('Memory usage: ', memoryUsage / 1024 / 1024 , ' MB')
    //     if (numCores > maxConnection) {
    //         console.log(`Connection is overload`);
    //     }
    //
    // }, TIMER_CHECK_OVERLOAD)
}

export {
    countConnect,
    checkOverload
}