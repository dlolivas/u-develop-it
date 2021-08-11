// this will be a central hub to pull them all together

const express = require('express');
const router = express.Router();
//add candidates routes
router.use(require('./candidateRoutes'));
//add voter routes
router.use(require('./voterRoutes'));

module.exports = router;