const express = require('express');
const router = express.Router();

const { register, login, me, confirmAdminPassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/admin.middleware');


router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, me);
router.get('/admin-check', verifyToken, requireAdmin, (req, res) => {
  res.json({
    ok: true,
    message: 'Acceso admin correcto.',
  });
});

router.post('/confirm-admin-password', verifyToken, requireAdmin, confirmAdminPassword);

module.exports = router;