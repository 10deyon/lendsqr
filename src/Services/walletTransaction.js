const AppError = require('../Services/AppError');
const db = require('./../../dbConfig');

module.exports = {
   store: async function(req, userWallet, next, type=false, receiver=false) {
      await db.transaction(async (trx) => {
         await trx('transactions').insert({
            amount: req.body.amount,
            category: type === true ? 'debit' : 'credit',
            narration: req.body.narration,
            user_id: req.user.id
         });
         
         const amount = type === true ? Number(userWallet[0].amount) - Number(req.body.amount) : 
         Number(userWallet[0].amount) + Number(req.body.amount);
         
         if (receiver.length > 0) {
            await trx('wallets').where('user_id', receiver[0].id).update({
               amount: (receiver[0].amount * 1) + Number(req.body.amount),
               balance_snapshot: req.body.amount,
            });
         }
         
         await trx('wallets').where('user_id', req.user.id).update({
            amount: amount,
            balance_snapshot: req.body.amount,
         });
      }).catch(err => {
         return next(new AppError('An error occured, please try again', 400));
      });
   },
   
   checkUser: async function(req) {
      const userWallet = await db('wallets').where('user_id', req.user.id);
      if (!userWallet) return next(new AppError('User wallet does not exist', 400));

      return userWallet;
   },
   
   walletBalance: async function(userId) {
      return await db('wallets').select('id', 'amount', 'user_id').where('user_id', userId);
   },

   validationReq: async function(req, schema, next) {
      const result = await schema.validate(req.body);

      const { value, error } = result; 
      const valid = error == null; 
  
      if (!valid) return next(new AppError(error.details[0].message, 400));
   }
}