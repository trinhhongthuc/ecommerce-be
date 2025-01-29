import app from "./src/app.js";
import dotenv from "dotenv";
import {CONFIG} from "./src/configs/config.mongoose.js";

dotenv.config();
const PORT = CONFIG.app.port || 8081;

const server = app.listen(PORT, () => {
    console.log('App running on PORT: ', PORT)
})

process.on('SIGINT', () => {
    server.close(() => console.log('Existing server'));
})
