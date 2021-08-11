// this will be a central hub to pull them all together

const express = require('express');
const router = express.Router();

router.use(require('./candidateRoutes'));

module.exports = router;