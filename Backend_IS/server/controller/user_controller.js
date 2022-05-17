require('dotenv').config();
const db = require('../util/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { jwtwrap } = require('../util/jwt');
const Joiput = require('../util/joiput');
const Redis = require('../util/cache');
const userprofile = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  res.send(who);
};

const creatorprofile = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  const [creator_profile] = await db.query(
    'SELECT * FROM creators_shows WHERE user_id = ?',
    [who.id]
  );
  res.send(creator_profile);
};

const updateuser = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  if (req.body.newprofileimage) {
    const cdnimage = req.body.newprofileimage.replace(
      `${process.env.S3_ORIGIN}`,
      `${process.env.CDN}/resize`
    );

    await db.query('UPDATE users SET user_image = ? WHERE user_id = ? ', [
      cdnimage,
      who.id,
    ]);
    return res.json({ status: 'update profile image url OK' });
  }

  let change = '';
  let validation;
  if (req.body.name === '' && req.body.email === '' && req.body.pwd === '') {
    return res.json({ error: 'Nohting Changed.' });
  }
  if (req.body.name !== '') {
    validation = Joiput.validate({
      Name: req.body.name,
    });
    if (validation.error) {
      return res.json({ error: 'Username length must be between 3~30.' });
    }
    change += `user_name = '${req.body.name}' ,`;
  }
  if (req.body.email !== '') {
    validation = Joiput.validate({
      Email: req.body.email,
    });
    if (validation.error) {
      return res.json({ error: 'E-mail format does not match.' });
    }
    change += `user_email = '${req.body.email}' ,`;
  }
  if (req.body.pwd !== '') {
    validation = Joiput.validate({
      Password: req.body.pwd,
    });
    if (validation.error) {
      return res.json({ error: 'Password length must be between 8~30.' });
    }
    const hashed_pwd = await bcrypt.hash(req.body.pwd, saltRounds);
    change += `user_password = '${hashed_pwd}' ,`;
  }
  allchange = change.slice(0, change.length - 1);
  const userquery = 'UPDATE users SET ' + allchange + 'WHERE user_id = ?;';
  const [userupdate] = await db.query(userquery, [who.id]);

  if (userupdate.affectedRows != 0) {
    const [newuser] = await db.query('SELECT * FROM users WHERE user_id = ?', [
      who.id,
    ]);
    let payload = {
      id: newuser[0].user_id,
      name: newuser[0].user_name,
      email: newuser[0].user_email,
      image: newuser[0].user_image,
      role: newuser[0].user_role,
      adult: newuser[0].user_adult,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED,
    });
    const [newprofile] = await db.query(
      'SELECT user_name, user_email, user_image FROM users WHERE user_id = ?',
      [who.id]
    );
    res.json({
      token: token,
      user_name: newprofile[0].user_name,
      user_email: newprofile[0].user_email,
      user_image: newprofile[0].user_image,
    });
  }
};

const updatecreator = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }

  const [show_target] = await db.query(
    'SELECT show_id FROM creators_shows WHERE user_id = ?',
    [who.id]
  );
  if (req.body.newshowimage) {
    await db.query(
      'UPDATE creators_shows SET show_image = ? WHERE user_id = ? ',
      [req.body.newshowimage, who.id]
    );
    const cdnimage = req.body.newshowimage.replace(
      `${process.env.S3_ORIGIN}`,
      `${process.env.CDN}/resize`
    );
    const [show_RSS] = await db.query(
      'UPDATE rss SET rss_image = ? WHERE rss_url LIKE ?',
      [cdnimage, `%${show_target[0].show_id}%`]
    );
    const [delcache] = await db.query(
      'SELECT rss_id FROM rss WHERE rss_url like ?',
      [`%${show_target[0].show_id}%`]
    );
    Redis.del(`${delcache[0].rss_id}`);

    return res.json({ status: 'update show image url OK' });
  }
  let change = '';
  let rsschange = '';
  if (
    req.body.cname === '' &&
    req.body.cmail === '' &&
    req.body.sname === '' &&
    req.body.sdes === '' &&
    req.body.scategory === 'choose new category'
  ) {
    return res.json({ error: 'Nohting Changed.' });
  }
  if (
    req.body.cname == '' &&
    req.body.cmail == '' &&
    req.body.sname == '' &&
    req.body.sdes == '' &&
    req.body.scategory == ''
  ) {
    return res.json({ error: 'Nohting Changed.' });
  }
  if (req.body.cname !== '') {
    change += `creator_name = '${req.body.cname}' ,`;
    rsschange += `rss_creator = '${req.body.cname}' ,`;
  }
  if (req.body.cmail !== '') {
    validation = Joiput.validate({
      Email: req.body.cmail,
    });
    if (validation.error) {
      return res.json({ error: validation.error.details[0].message });
    }
    change += `creator_email = '${req.body.cmail}' ,`;
  }
  if (req.body.sname !== '') {
    change += `show_name = '${req.body.sname}' ,`;
    rsschange += `rss_title = '${req.body.sname}' ,`;
  }
  if (req.body.sdes !== '') {
    change += `show_des = '${req.body.sdes}' ,`;
  }

  if (
    req.body.scategory !== '' &&
    req.body.scategory !== 'choose new category'
  ) {
    const cmain = req.body.scategory.split('_')[0];
    const csub = req.body.scategory.split('_')[1];
    change += `show_category_main = '${cmain}', show_category_sub = '${csub}' ,`;
    rsschange += `rss_category_main = '${cmain}', rss_category_sub = '${csub}' ,`;
  }
  allchange = change.slice(0, change.length - 1);
  const creatorquery =
    'UPDATE creators_shows SET ' + allchange + 'WHERE user_id = ?;';
  const [creatorupdate] = await db.query(creatorquery, [who.id]);
  if (rsschange !== '') {
    allrsschange = rsschange.slice(0, rsschange.length - 1);
    const rssquery = 'UPDATE rss SET ' + allrsschange + 'WHERE rss_url LIKE ?;';
    const [rssupdate] = await db.query(rssquery, [
      `%${show_target[0].show_id}%`,
    ]);
  }
  if (creatorupdate.affectedRows !== 0) {
    const [newcreatorinfo] = await db.query(
      'SELECT * FROM creators_shows WHERE user_id = ?',
      [who.id]
    );

    const [delcache] = await db.query(
      'SELECT rss_id FROM rss WHERE rss_url like ?',
      [`%${show_target[0].show_id}%`]
    );
    Redis.del(`${delcache[0].rss_id}`);
    res.send(newcreatorinfo[0]);
  }
};

const updateepisode = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  try {
    const infos = req.body;
    if (
      infos.title === '' &&
      infos.des === '' &&
      infos.file === '' &&
      infos.duration === 0 &&
      infos.length === '' &&
      infos.explicit === '' &&
      infos.image === '' &&
      infos.episode === ''
    ) {
      return res.json({ error: 'Nohting Changed.' });
    }
    if (
      infos.title === '' &&
      infos.des === '' &&
      infos.file === '' &&
      infos.duration === 0 &&
      infos.length === '' &&
      infos.explicit === 'explicit status' &&
      infos.image === '' &&
      infos.episode === ''
    ) {
      return res.json({ error: 'Nohting Changed.' });
    }

    let change = '';
    if (infos.title !== '') {
      change += `episode_title = '${infos.title}' ,`;
    }
    if (infos.des !== '') {
      change += `episode_des = '${infos.des}' ,`;
    }
    if (infos.file !== '') {
      const cdnfile = infos.file.replace(
        `${process.env.S3_ORIGIN}`,
        `${process.env.CDN}`
      );
      change += `episode_file = '${cdnfile}' ,`;
    }
    if (infos.duration !== '') {
      change += `episode_duration = '${infos.duration}' ,`;
    }
    if (infos.length !== '') {
      change += `episode_length = '${infos.length}' ,`;
    }
    if (infos.explicit !== '') {
      change += `episode_explicit = '${infos.explicit}' ,`;
    }
    if (infos.image !== '') {
      const cdnimage = infos.image.replace(
        `${process.env.S3_ORIGIN}`,
        `${process.env.CDN}/resize`
      );
      change += `episode_image = '${cdnimage}' ,`;
    }

    if (infos.episode !== '') {
      change += `episode_episode = '${infos.episode}' ,`;
    }
    allchange = change.slice(0, change.length - 1);
    const epiquery =
      'UPDATE episodes SET ' +
      allchange +
      'WHERE show_id = ? AND episode_id = ?';
    const [epiupdate] = await db.query(epiquery, [
      infos.show_id,
      infos.episode_id,
    ]);
    if (epiupdate.affectedRows !== 0) {
      const [newepiinfo] = await db.query(
        'SELECT * FROM episodes WHERE show_id = ? AND episode_id = ?;',
        [infos.show_id, infos.episode_id]
      );
      const [delcache] = await db.query(
        'SELECT rss_id FROM rss WHERE rss_url like ?',
        [`%${infos.show_id}%`]
      );
      Redis.del(`${delcache[0].rss_id}`);
      res.send(newepiinfo[0]);
    }
  } catch (err) {
    res.json({ error: err });
  }
};

module.exports = {
  userprofile,
  creatorprofile,
  updateuser,
  updatecreator,
  updateepisode,
};
