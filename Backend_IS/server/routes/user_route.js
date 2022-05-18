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
  ishostshow,
  historylist,
  sublist,
  subshows,
  myshowpage,
  episoderemove,
} = require('../controller/show_controller');
const { showkeyword } = require('../controller/search_controller');
const { counter_logins } = require('../controller/counter_controller');
const {
  userProfile,
  creatorProfile,
  updateUser,
  updateCreator,
  updateEpisode,
} = require('../controller/user_controller');
const { s3Upload } = require('../util/s3');
// test chatroom for socket
const { chatmsg, chathistory } = require('../controller/chatroom_controller');
router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/s3').post(s3Upload);
router.route('/userprofile').get(userProfile);
router.route('/userprofile').put(updateUser);
router.route('/userhistory').post(userhistory);
router.route('/userhistory').get(historylist);
router.route('/creatorprofile').get(creatorProfile);
router.route('/creatorprofile').put(updateCreator);
router.route('/counter_logins').get(counter_logins);
router.route('/rss/:rss').get(rssfeed);
router.route('/showlist').get(showlist);
router.route('/myshowpage').get(myshowpage);
router.route('/ishostshow').get(ishostshow);
router.route('/showchoice/:id').get(showchoice);
router.route('/episodechoice/:episode').get(episodechoice);
router.route('/showsubscribe').post(showsubscribe);
router.route('/showunsub').post(showunsub);
router.route('/switcher').post(switcher);
router.route('/episode').post(episode);
router.route('/episode').delete(episoderemove);
router.route('/episode').put(updateEpisode);
router.route('/showkeyword').post(showkeyword);
router.route('/chathistory').post(chathistory);
router.route('/sublist').get(sublist);
router.route('/subshows').get(subshows);
module.exports = router;
