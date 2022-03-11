const catchAsync = require('../Services/catchAsync');
const AppError = require('../Services/AppError');
const { store, checkUser, walletBalance, validationReq } = require('../Services/walletTransaction');
const db = require('./../../dbConfig');
const Joi = require('joi');

exports.fundWallet = catchAsync(async(req, res, next) => {
    const schema = Joi.object({
        narration: Joi.string().required(),
        amount: Joi.number().greater(99).required(),
    });

    await validationReq(req, schema, next);
    
    // Check if the user exist on the system
    const userWallet = await checkUser(req, next);
    
    // Save all details on the database
    await store(req, userWallet, next);
    
    // Get the updated wallet balance of the user performing the transaction
    const wallet = await walletBalance(req.user.id, next);

    console.log(wallet)
    res.status(201).json({
        error: false,
        status: 'success',
        data: {
            wallet: wallet[0]
        }
    });
})

exports.chargeWallet = catchAsync(async(req, res, next) => {
    const schema = Joi.object({
        amount: Joi.number().greater(100).required(),
        narration: Joi.string().required()
    });

    await validationReq(req, schema, next);

    // Check if the user exist on the system
    const userWallet = await checkUser(req, next);
    if (+userWallet[0].amount < req.body.amount) return next(new AppError('you do not have sufficient funds', 400));
    
    // Save all details on the database
    await store(req, userWallet, next, true);
    
    // Get the updated wallet balance of the user performing the transaction
    const wallet = await walletBalance(req.user.id, next);
    
    res.status(201)
    .json({
        error: false,
        status: "success",
        data: {
            wallet: wallet[0]
        }
    });
});

exports.transferFunds = catchAsync(async(req, res, next) => {
    const schema = Joi.object({
        amount: Joi.number().greater(100).required(),
        narration: Joi.string().required(),
        receiver: Joi.string().required()
    });
    
    await validationReq(req, schema, next);
    
    // Check if the user exist on the system
    const userWallet = await checkUser(req, next);
    if (+userWallet[0].amount < req.body.amount) return next(new AppError('you do not have sufficient funds', 400));
    
    const receiver = await db('users').select('*').where({ 'username': req.body.receiver }).orWhere({ 'email': req.body.receiver });
    if (!receiver) return next(new AppError('User does not exist', 400));

    const receiverWallet = await db('wallets').select('*').where({ 'user_id': receiver[0].id });
    if (!receiverWallet) return next(new AppError('User does not exist', 400));
    
    // Save all details on the database
    await store(req, userWallet, next, true, receiverWallet);

    // Get the updated wallet balance of the user performing the transaction
    const wallet = await walletBalance(req.user.id, next);
    
    res.status(201)
    .json({
        error: false,
        status: "success",
        data: {
            wallet: wallet[0]
        }
    });
});
