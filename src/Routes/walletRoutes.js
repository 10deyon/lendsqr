const express = require('express');
const authMiddleware = require('./../Middleware/authMiddleware');
const walletController = require('../Controllers/walletController');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/debit').post(walletController.chargeWallet);
router.route('/credit').post(walletController.fundWallet);
router.route('/transfer').post(walletController.transferFunds);

module.exports = router;
