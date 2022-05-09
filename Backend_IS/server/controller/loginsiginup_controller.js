require('dotenv').config();
const db = require('../util/mysql');
const joi = require('../util/joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { name, email, pwd, birth } = req.body;
  const validation = joi.validate({
    Username: name,
    Email: email,
    Password: pwd,
    Birthday: birth,
  });
  image = `${process.env.CDN}/IS_LOGO.png`;
  if (validation.error) {
    return res.status(200).json({ error: validation.error.details[0].message });
  }
  const email_check = await db.query(
    `SELECT user_id FROM users WHERE user_email =?`,
    [email]
  );
  if (email_check[0][0]) {
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
    await db.query('START TRANSACTION');
    const newuser = await db.query(
      'INSERT INTO users ( user_name, user_email, user_status, user_password, user_provider, user_provider_ID, user_image, user_birth, user_adult, user_role) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [name, email, 1, hashed_pwd, 'native', 'none', image, birth, adult, 2]
    );

    const [id] = await db.query(
      'SELECT user_id FROM users WHERE user_email = ?',
      [email]
    );
    const user_id = id[0].user_id;
    const show_id = uuid.v4();
    const show_des = 'This is ' + name + "'s Podcast show!";
    const show_explicit = 0;
    const show_category_main = 'Leisure';
    const show_category_sub = 'Hobbies';
    const newcreator = await db.query(
      'INSERT INTO creators_shows (user_id, show_id,show_name, show_des, show_image, show_explicit, show_category_main, show_category_sub,  show_subscriber, show_status, show_click, creator_name, creator_email, creator_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        user_id,
        show_id,
        `${name}'s Podcast!`,
        show_des,
        image,
        show_explicit,
        show_category_main,
        show_category_sub,
        0,
        1,
        0,
        name,
        email,
        0,
      ]
    );
    await db.query(
      'INSERT INTO counters (user_id, counter_logins) VALUES (?,?)',
      [user_id, 1]
    );
    await db.query(
      `INSERT INTO rss (rss_title, rss_url, rss_creator, rss_image, rss_explicit, rss_category_main, rss_category_sub, rss_hot, rss_status) VALUES (?,?,?,?,?,?,?,?,?);`,

      [
        `${name}'s Podcast!`,
        `https://intoxicating.space/api/1.0/user/rss/${show_id}`,
        name,
        image,
        show_explicit,
        show_category_main,
        show_category_sub,
        1,
        0,
      ]
    );
    await db.query('COMMIT');
    //const upload = await s3upload('123', 'user', 'image/jpeg', 'test.jpg');

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
  const [user_info] = await db.query('SELECT * FROM users WHERE user_email=?', [
    email,
  ]);
  if (!user_info[0]) {
    return res.json({ error: 'signup first' });
  }
  const checkpwd = await bcrypt.compare(pwd, user_info[0].user_password);
  if (!checkpwd) {
    return res.status(200).json({ error: 'wrong password' });
  }
  const infos = user_info[0];
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
  await db.query(
    'UPDATE users SET user_last_login = ? , user_adult = ? WHERE user_id = ?',
    [timestamp, adult, user_id]
  );
  await db.query(
    'UPDATE counters SET counter_logins = counter_logins+1 WHERE user_id = ?',
    [user_id]
  );
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED,
  });
  const [show_image] = await db.query(
    'SELECT show_image FROM creators_shows WHERE user_id = ?',
    [user_id]
  );
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
