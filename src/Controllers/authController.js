const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../Services/catchAsync');
const AppError = require('../Services/AppError');
const db = require('./../../dbConfig');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, req, res) => {
    const token = signToken(user[0].id);
    
    const cookieOptions = {
        expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    return token;
}

exports.signUp = catchAsync(async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
    }).with('password', 'repeat_password');

    const result = schema.validate(req.body);

    const { value, error } = result; 
    const valid = error == null; 

    if (!valid) return next(new AppError(error.details[0].message, 400));

    const checkUsername = await db.from('users').where({ username: value.username }).select('*');
    if (checkUsername.length > 0) return next(new AppError('This username has already been taken', 400));
    
    let userId = ''
    await db.transaction(async (trx) => {
        const salt = await bcrypt.genSalt(10);
        value.password = await bcrypt.hash(req.body.password, salt);
        
        userId += await trx('users').insert({
            name: value.name,
            email: value.email,
            password: value.password,
            username: value.username
        })
        
        await trx('wallets').insert({
            amount: 0.00,
            balance_snapshot: 0.00,
            user_id: userId[0]
        })
    });
    
    const user = await db.from('users').where({ id: userId }).select('id', 'name', 'email', 'username');
    const token = await createSendToken(user, req, res);
    const wallet = await db.from('wallets').where({ user_id: userId }).select('id', 'amount', 'balance_snapshot', 'user_id');

    res.status(201).json({
        status: 'success',
        data: {
            token,
            user: user[0],
            wallet: wallet[0],
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Provide your email and password', 400));
    
    const user = await db('users').where({'email': email}).select('id', 'name', 'email', 'username', 'password');
    if(!user || !(await correctPassword(password, user[0].password)))
        return next(new AppError('Incorrect email or password', 401));

    const wallet = await db.from('wallets').where({ user_id: user[0].id }).select('id', 'amount', 'balance_snapshot', 'user_id');
    const token = await createSendToken(user, req, res);
    
    user[0].password = undefined;
    res.status(200).json({
        status: 'success',
        data: {
            token,
            user: user[0],
            wallet: wallet[0]
        },
    });
});

const correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
};
