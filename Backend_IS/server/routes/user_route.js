const router = require('express').Router();
const { wrapAsync } = require('../util/wrapAsync');
const { signUp, signIn } = require('../controller/loginsiginup_controller');
const { rssFeed } = require('../controller/rss_controller');
const {
  showList,
  showChoice,
  episodeChoice,
  showSubscribe,
  showUnsub,
  switcher,
  userHistory,
  episode,
  isHostShow,
  historyList,
  subList,
  subShows,
  myShowPage,
  episodeRemove,
} = require('../controller/show_controller');
const { showKeyword } = require('../controller/search_controller');
const { counterLogins } = require('../controller/counter_controller');
const {
  userProfile,
  creatorProfile,
  updateUser,
  updateCreator,
  updateEpisode,
} = require('../controller/user_controller');
const { s3Upload } = require('../util/s3');
const { chatHistory } = require('../controller/chatroom_controller');
router.route('/signup').post(wrapAsync(signUp));
router.route('/signin').post(wrapAsync(signIn));
router.route('/s3').post(wrapAsync(s3Upload));
router.route('/userprofile').get(wrapAsync(userProfile));
router.route('/userprofile').put(wrapAsync(updateUser));
router.route('/userhistory').post(wrapAsync(userHistory));
router.route('/userhistory').get(wrapAsync(historyList));
router.route('/creatorprofile').get(wrapAsync(creatorProfile));
router.route('/creatorprofile').put(wrapAsync(updateCreator));
router.route('/counter_logins').get(wrapAsync(counterLogins));
router.route('/rss/:rss').get(wrapAsync(rssFeed));
router.route('/showlist').get(wrapAsync(showList));
router.route('/myshowpage').get(wrapAsync(myShowPage));
router.route('/ishostshow').get(wrapAsync(isHostShow));
router.route('/showchoice/:id').get(wrapAsync(showChoice));
router.route('/episodechoice/:episode').get(wrapAsync(episodeChoice));
router.route('/showsubscribe').post(wrapAsync(showSubscribe));
router.route('/showunsub').post(wrapAsync(showUnsub));
router.route('/switcher').post(wrapAsync(switcher));
router.route('/episode').post(wrapAsync(episode));
router.route('/episode').delete(wrapAsync(episodeRemove));
router.route('/episode').put(wrapAsync(updateEpisode));
router.route('/showkeyword').post(wrapAsync(showKeyword));
router.route('/chathistory').post(wrapAsync(chatHistory));
router.route('/sublist').get(wrapAsync(subList));
router.route('/subshows').get(wrapAsync(subShows));
module.exports = router;
