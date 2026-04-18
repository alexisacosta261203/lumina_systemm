const express = require('express');
const router = express.Router();

const { createPurchase } = require('../controllers/purchases.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, createPurchase);

module.exports = router;