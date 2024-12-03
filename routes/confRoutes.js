const express = require('express');
const { sendActivationLink, activateAccount } = require('../controllers/confController');
const router = express.Router();

router.post('/send-activation-link', sendActivationLink);
router.get('/activate-account', activateAccount);

module.exports = router;
