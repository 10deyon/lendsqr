const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./../src/Services/AppError');
const GlobalErrorHandler = require('./Controllers/errorController');

const userRouter = require('./Routes/userRoutes');
const walletRouter = require('./Routes/walletRoutes');

const app = express();

// set this so as to have access to the https value from heroku
app.enable('trust proxy');

app.use(cors());
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.APP_STATE === 'development') app.use(morgan('dev'));

// Limit requests from same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 3600 * 1000,
    message: 'Too many requests, please try again after 1hour'
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against XSS attacks
app.use(xss());

// this middleware compresses all text except images that is being sent to client
app.use(compression());

//ROUTES
app.get('/', (req, res) => {
    res.send('lendsqr');
});

app.use('/api/users', userRouter);
app.use('/api/wallet', walletRouter);

//MIDDLEWARE TO HANDLE IF A ROUTE IS NOT FOUND
app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

//ERROR HANDLING MIDDLEWARE
app.use(GlobalErrorHandler);

module.exports = app;
