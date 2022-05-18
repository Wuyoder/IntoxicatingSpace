require('dotenv').config();
const db = require('../util/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { jwtwrap } = require('../util/jwt');
const Joiput = require('../util/joiput');
const Cache = require('../util/cache');
const cru = require('../model/cru_model');
const userModel = require('../model/user_model');
const showModel = require('../model/show_model');

const userProfile = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  res.send(who);
};

const creatorProfile = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  const result = await cru.select('creators_shows', ['*'], {
    user_id: who.id,
  });
  return res.send(result);
};

const updateUser = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  if (req.body.newprofileimage) {
    const cdnimage = req.body.newprofileimage.replace(
      `${process.env.S3_ORIGIN}`,
      `${process.env.CDN}/resize`
    );
    await cru.update(
      'users',
      { user_image: cdnimage },
      {
        user_id: who.id,
      }
    );
    return res.json({ status: 'update profile image url OK' });
  }

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
    await cru.update(
      'users',
      { user_name: req.body.name },
      { user_id: who.id }
    );
  }
  if (req.body.email !== '') {
    validation = Joiput.validate({
      Email: req.body.email,
    });
    if (validation.error) {
      return res.json({ error: 'E-mail format does not match.' });
    }
    await cru.update(
      'users',
      { user_email: req.body.email },
      { user_id: who.id }
    );
  }
  if (req.body.pwd !== '') {
    validation = Joiput.validate({
      Password: req.body.pwd,
    });
    if (validation.error) {
      return res.json({ error: 'Password length must be between 8~30.' });
    }
    const hashed_pwd = await bcrypt.hash(req.body.pwd, saltRounds);
    await cru.update(
      'users',
      { user_password: hashed_pwd },
      { user_id: who.id }
    );
  }
  const newUser = await cru.select('users', ['*'], { user_id: who.id });
  let payload = {
    id: newUser[0].user_id,
    name: newUser[0].user_name,
    email: newUser[0].user_email,
    image: newUser[0].user_image,
    role: newUser[0].user_role,
    adult: newUser[0].user_adult,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED,
  });
  const newprofile = await cru.select(
    'users',
    ['user_name', 'user_email', 'user_image'],
    { user_id: who.id }
  );
  return res.json({
    token: token,
    user_name: newprofile[0].user_name,
    user_email: newprofile[0].user_email,
    user_image: newprofile[0].user_image,
  });
};

const updateCreator = async (req, res) => {
  const who = await jwtwrap(req);
  if (who.error) {
    return res.status(200).json({ error: who.error });
  }
  const show_target = await cru.select('creators_shows', ['show_id'], {
    user_id: who.id,
  });
  if (req.body.newshowimage) {
    await cru.update(
      'creators_shows',
      { show_image: req.body.newshowimage },
      { user_id: who.id }
    );
    const cdnimage = req.body.newshowimage.replace(
      `${process.env.S3_ORIGIN}`,
      `${process.env.CDN}/resize`
    );
    await userModel.updateRssInfo(
      'rss_image',
      cdnimage,
      `%${show_target[0].show_id}%`
    );
    const delCache = await showModel.delId(`%${show_target[0].show_id}%`);
    Cache.del(`${delCache[0].rss_id}`);
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
    await cru.update(
      'creators_shows',
      { creator_name: req.body.cname },
      { user_id: who.id }
    );
    await userModel.updateRssInfo(
      'rss_creator',
      req.body.cname,
      show_target[0].show_id
    );
  }
  if (req.body.cmail !== '') {
    validation = Joiput.validate({
      Email: req.body.cmail,
    });
    if (validation.error) {
      return res.json({ error: validation.error.details[0].message });
    }
    await cru.update(
      'creators_shows',
      { creator_email: req.body.cmail },
      { user_id: who.id }
    );
  }
  if (req.body.sname !== '') {
    await cru.update(
      'creators_shows',
      { show_name: req.body.sname },
      { user_id: who.id }
    );
    await userModel.updateRssInfo(
      'rss_title',
      req.body.sname,
      show_target[0].show_id
    );
  }
  if (req.body.sdes !== '') {
    await cru.update(
      'creators_shows',
      { show_des: req.body.sdes },
      { user_id: who.id }
    );
  }
  if (
    req.body.scategory !== '' &&
    req.body.scategory !== 'choose new category'
  ) {
    const cmain = req.body.scategory.split('_')[0];
    const csub = req.body.scategory.split('_')[1];
    await cru.update(
      'creators_shows',
      { show_category_main: cmain },
      { user_id: who.id }
    );
    await cru.update(
      'creators_shows',
      { show_category_sub: csub },
      { user_id: who.id }
    );
    await userModel.updateRssInfo(
      'rss_category_main',
      cmain,
      show_target[0].show_id
    );
    await userModel.updateRssInfo(
      'rss_category_sub',
      csub,
      show_target[0].show_id
    );
  }
  const newCreatorInfo = await cru.select('creators_shows', ['*'], {
    user_id: who.id,
  });
  const delCache = await showModel.delId(show_target[0].show_id);
  Cache.del(`${delCache[0].rss_id}`);
  return res.send(newCreatorInfo[0]);
};

const updateEpisode = async (req, res) => {
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
      await userModel.updateNewEpi(
        'episode_title',
        infos.title,
        infos.show_id,
        infos.episode_id
      );
    }
    if (infos.des !== '') {
      await userModel.updateNewEpi(
        'episode_des',
        infos.des,
        infos.show_id,
        infos.episode_id
      );
    }
    if (infos.file !== '') {
      const cdnfile = infos.file.replace(
        `${process.env.S3_ORIGIN}`,
        `${process.env.CDN}`
      );
      await userModel.updateNewEpi(
        'episode_file',
        cdnfile,
        infos.show_id,
        infos.episode_id
      );
    }
    if (infos.duration !== '') {
      await userModel.updateNewEpi(
        'episode_duration',
        infos.duration,
        infos.show_id,
        infos.episode_id
      );
    }
    if (infos.length !== '') {
      await userModel.updateNewEpi(
        'episode_length',
        infos.length,
        infos.show_id,
        infos.episode_id
      );
    }
    if (infos.explicit !== '') {
      await userModel.updateNewEpi(
        'episode_explicit',
        infos.explicit,
        infos.show_id,
        infos.episode_id
      );
    }
    if (infos.image !== '') {
      const cdnimage = infos.image.replace(
        `${process.env.S3_ORIGIN}`,
        `${process.env.CDN}/resize`
      );
      await userModel.updateNewEpi(
        'episode_image',
        cdnimage,
        infos.show_id,
        infos.episode_id
      );
    }

    if (infos.episode !== '') {
      await userModel.updateNewEpi(
        'episode_episode',
        infos.episode,
        infos.show_id,
        infos.episode_id
      );
    }
    const newEpiInfo = await userModel.newEpi(infos.show_id, infos.episode_id);
    const delCache = await showModel.delId(infos.show_id);
    Cache.del(`${delCache[0].rss_id}`);
    res.send(newEpiInfo[0]);
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = {
  userProfile,
  creatorProfile,
  updateUser,
  updateCreator,
  updateEpisode,
};
