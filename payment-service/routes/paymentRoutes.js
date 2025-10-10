const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');

router.route('/').post(processPayment);

module.exports = router;