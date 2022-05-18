require('dotenv').config();
const joi = require('../util/joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const cru = require('../model/cru_model');
const signup = async (req, res) => {
  console.log(req.body);
  const { name, email, pwd, birth } = req.body;
  const validation = joi.validate({
    Username: name,
    Email: email,
    Password: pwd,
    Birthday: birth,
  });
  image = `${process.env.CDN}/IS_LOGO.png`;
  if (validation.error) {
    if (validation.error.details[0].message.search('Password') !== -1) {
      return res
        .status(200)
        .json({ error: 'Password length must be between 8~30.' });
    }
    if (validation.error.details[0].message.search('Email') !== -1) {
      return res.status(200).json({ error: 'E-mail format does not match.' });
    }
    if (validation.error.details[0].message.search('Username') !== -1) {
      return res
        .status(200)
        .json({ error: 'Username length must be between 3~30.' });
    }
    if (validation.error.details[0].message.search('Birthday') !== -1) {
      return res.status(200).json({ error: 'Birthday format does not match.' });
    }
    return res.status(200).json({ error: validation.error.details[0].message });
  }
  const today = new Date(new Date().setFullYear(new Date().getFullYear()));
  const year = req.body.birth.split('-')[0];
  const month = req.body.birth.split('-')[1];
  const day = req.body.birth.split('-')[2];
  const birthdate = new Date(year, month - 1, day);
  if (today - birthdate < 0) {
    return res.status(200).json({
      error: 'Are you a Future man? Please fill in correct information.',
    });
  }
  if (today - birthdate > 4733568500433) {
    return res.status(200).json({
      error: 'Honesty is the best policy. Please fill in correct information.',
    });
  }
  const email_check = await cru.select('users', ['user_id'], {
    user_email: email,
  });
  if (email_check[0]) {
    return res
      .status(200)
      .json({ error: 'the email address is already in use.' });
  }
  const hashed_pwd = await bcrypt.hash(pwd, saltRounds);

  const adult_boundary = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18)
  );
  let adult;
  if (birth < adult_boundary) {
    adult = 1;
  } else {
    adult = 0;
  }
  try {
    const startTrans = await cru.startTrans();
    const newUser = await cru.insert('users', {
      user_name: name,
      user_email: email,
      user_status: 1,
      user_password: hashed_pwd,
      user_provider: 'native',
      user_provider_ID: 'none',
      user_image: image,
      user_birth: birth,
      user_adult: adult,
      user_role: 2,
    });
    const id = await cru.select('users', ['user_id'], { user_email: email });
    const user_id = id[0].user_id;
    const show_id = uuid.v4();
    const show_des = 'This is ' + name + "'s Podcast show!";
    const show_explicit = 0;
    const show_category_main = 'Leisure';
    const show_category_sub = 'Hobbies';
    const newCreator = await cru.insert('creators_shows', {
      user_id: user_id,
      show_id: show_id,
      show_name: `${name}'s Podcast!`,
      show_des: show_des,
      show_image: image,
      show_explicit: show_explicit,
      show_category_main: show_category_main,
      show_category_sub: show_category_sub,
      show_subscriber: 0,
      show_status: 1,
      show_click: 0,
      creator_name: name,
      creator_email: email,
      creator_status: 0,
    });
    const firstLogin = cru.insert('counters', {
      user_id: user_id,
      counter_logins: 1,
    });

    const insertRss = await cru.insert('rss', {
      rss_title: `${name}'s Podcast!`,
      rss_url: `https://api.intoxicating.space/api/1.0/user/rss/${show_id}`,
      rss_creator: name,
      rss_image: image,
      rss_explicit: show_explicit,
      rss_category_main: show_category_main,
      rss_category_sub: show_category_sub,
      rss_hot: 1,
      rss_status: 1,
    });
    const commitTrans = await cru.commitTrans();
    return res.status(200).json({
      status:
        'Your account has been successfully created. Please turn to signin.',
    });
  } catch (err) {
    return res.json({ error: err });
  }
};

const signin = async (req, res) => {
  const { email, pwd } = req.body;
  const userInfo = await cru.select('users', ['*'], { user_email: email });
  if (!userInfo[0]) {
    return res.json({ error: 'signup first' });
  }
  const checkpwd = await bcrypt.compare(pwd, userInfo[0].user_password);
  if (!checkpwd) {
    return res.status(200).json({ error: 'wrong password' });
  }
  const infos = userInfo[0];
  const {
    user_id,
    user_name,
    user_email,
    user_birth,
    user_status,
    user_image,
    user_adult,
    user_role,
  } = infos;
  let payload = {
    id: user_id,
    name: user_name,
    email: user_email,
    image: user_image,
    role: user_role,
  };
  const adult_boundary = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18)
  );
  let adult;
  const birth = infos.user_birth;
  if (birth < adult_boundary) {
    adult = 1;
  } else {
    adult = 0;
  }
  payload.adult = adult;
  const timestamp = new Date();
  await cru.update(
    'users',
    { user_last_login: timestamp, user_adult: adult },
    { user_id: user_id }
  );
  const loginTimes = await cru.select('counters', ['counter_logins'], {
    user_id: user_id,
  });
  const newLoginTimes = loginTimes[0].counter_logins + 1;

  await cru.update(
    'counters',
    { counter_logins: newLoginTimes },
    { user_id: user_id }
  );
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED,
  });
  const show_image = await cru.select('creators_shows', ['show_image'], {
    user_id: user_id,
  });
  return res.json({
    data: {
      token: token,
      expired: process.env.JWT_EXPIRED,
      user: payload,
      show_image: show_image[0].show_image,
    },
  });
};

module.exports = { signup, signin };
