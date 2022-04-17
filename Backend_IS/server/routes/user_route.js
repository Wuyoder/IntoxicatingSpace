const router = require('express').Router();
const { signup, signin } = require('../controller/loginsiginup_controller');
const { rssfeed } = require('../controller/rss_controller');
const {
  showlist,
  showchoice,
  episodechoice,
} = require('../controller/show_controller');
router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/rss/:rss').get(rssfeed);
router.route('/showlist').get(showlist);
router.route('/showchoice/:id').get(showchoice);
router.route('/episodechoice/:episode').get(episodechoice);
module.exports = router;
