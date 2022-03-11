const AppError = require('../Services/AppError');

const handleJWTError = () => new AppError('unauthorised user. please log in', 401);

const handleJWTExpiredError = () => new AppError('token expired, please login again', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });    
}

const sendErrorProd = (err, res) => {
    console.log(`this is error: ${err}`);
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('Error: ', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        
        if(error.name === 'JsonWebTokenError') error = handleJWTError();
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if(error.code === 'SQLITE_CONSTRAINT') error = handleDuplicateFieldsDB();
        
        sendErrorProd(error, res)
    }
}
