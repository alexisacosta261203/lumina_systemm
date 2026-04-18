const express = require('express');
const router = express.Router();

const {
  createPurchase,
  getMyPurchasedCourseIds,
  hasPurchasedCourse,
} = require('../controllers/purchases.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/mine/course-ids', verifyToken, getMyPurchasedCourseIds);
router.get('/mine/has-course/:cursoId', verifyToken, hasPurchasedCourse);
router.post('/', verifyToken, createPurchase);

module.exports = router;