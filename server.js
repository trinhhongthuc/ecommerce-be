import app from "./src/app.js";

const PORT = 8081;

const server = app.listen(PORT, () => {
    console.log('App running on PORT: ', PORT)
})

process.on('SIGINT', () => {
    server.close(() => console.log('Existing server'));
})
