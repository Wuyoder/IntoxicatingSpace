const router = require('express').Router();
const { newrss } = require('../controller/admin_controller');
router.route('/newrss').post(newrss);
module.exports = router;
