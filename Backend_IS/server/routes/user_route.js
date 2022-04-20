const router = require('express').Router();
const { signup, signin } = require('../controller/loginsiginup_controller');
const { rssfeed } = require('../controller/rss_controller');
const {
  showlist,
  showchoice,
  episodechoice,
  showsubscribe,
  showunsub,
  switcher,
  userhistory,
  episode,
} = require('../controller/show_controller');
const { showkeyword } = require('../controller/search_controller');
const { counter_logins } = require('../controller/counter_controller');
const {
  userprofile,
  creatorprofile,
} = require('../controller/user_controller');
const { s3upload } = require('../util/S3');
router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/s3upload').post(s3upload);
router.route('/userprofile').get(userprofile);
router.route('/userhistory').post(userhistory);
router.route('/creatorprofile').get(creatorprofile);
router.route('/counter_logins').get(counter_logins);
router.route('/rss/:rss').get(rssfeed);
router.route('/showlist').get(showlist);
router.route('/showchoice/:id').get(showchoice);
router.route('/episodechoice/:episode').get(episodechoice);
router.route('/showsubscribe').post(showsubscribe);
router.route('/showunsub').post(showunsub);
router.route('/switcher').post(switcher);
router.route('/episode').post(episode);
router.route('/showkeyword').post(showkeyword);
module.exports = router;
