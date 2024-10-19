const express = require('express');
const { sendWaitlist, getWaitlist } = require('../controllers/waitlistController');
const router = express.Router();

router.post('/sendWaitlist', sendWaitlist);
router.get('/getWaitlist', getWaitlist);

module.exports = router;
