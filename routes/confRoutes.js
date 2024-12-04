const express = require('express');
const { sendActivationLink, activateAccount } = require('../controllers/confController');
const { registerUser } = require('../controllers/regController');
const { loginUser } = require('../controllers/logController');
const router = express.Router();

router.post('/send-activation-link', sendActivationLink);
router.get('/activate-account', activateAccount);

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;