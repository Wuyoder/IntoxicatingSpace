const router = require('express').Router();
const { wrapAsync } = require('../util/wrapAsync');
const { newRss } = require('../controller/admin_controller');
router.route('/newrss').post(wrapAsync(newRss));
module.exports = router;
