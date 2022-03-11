const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require(`${__dirname}/src/app`);

//SERVER
const port = process.env.APP_PORT || 3001;
const server = app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION WARNING');
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION WARNING');
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', err => {
    console.log('SIGTERM RECEIVED. shutting down');
    server.close(() => {
        console.log("process terminated");
        process.exit(1);
    });
});

module.exports = server;
