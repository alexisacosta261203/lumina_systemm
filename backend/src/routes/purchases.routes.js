const express = require('express');
const router = express.Router();

const { createPurchase } = require('../controllers/purchases.controller');

router.post('/', createPurchase);

module.exports = router;