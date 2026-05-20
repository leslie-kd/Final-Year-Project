const express = require('express');
const router = express.Router();
const { getProviders } = require('../controllers/userController');

router.get('/providers', getProviders);

module.exports = router;
