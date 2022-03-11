const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../Services/AppError');
const db = require('./../../dbConfig');
const catchAsync = require('../Services/catchAsync');

module.exports = {
   protect: catchAsync(async(req, res, next) => {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
         token = req.headers.authorization.split(' ')[1];
      }
      if (!token) return next(new AppError('unauthenticated user', 401));
      
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      
      const currentUser = await db('users').select('*').where('id', decoded.id);
      if(!currentUser) return next(new AppError('invalid user token', 401));
      
      req.user = currentUser[0];
      next(); 
   })
};