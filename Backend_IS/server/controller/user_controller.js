const db = require('../util/mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { jwtwrap } = require('../util/jwt');
const Joiput = require('../util/joiput');
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
    await db.query('UPDATE users SET user_image = ? WHERE user_id = ? ', [
      req.body.newprofileimage,
      who.id,
    ]);
    return res.json({ status: 'update profile image url OK' });
  }

  let change = '';
  let validation;
  if (req.body.name === '' && req.body.email === '' && req.body.pwd === '') {
    return res.json({ error: 'nothing change' });
  }
  if (req.body.name !== '') {
    validation = Joiput.validate({
      name: req.body.name,
    });
    if (validation.error) {
      return res.json({ error: validation.error.details[0].message });
    }
    change += `user_name = '${req.body.name}' ,`;
  }
  if (req.body.email !== '') {
    validation = Joiput.validate({
      email: req.body.email,
    });
    if (validation.error) {
      return res.json({ error: validation.error.details[0].message });
    }
    change += `user_email = '${req.body.email}' ,`;
  }
  if (req.body.pwd !== '') {
    validation = Joiput.validate({
      pwd: req.body.pwd,
    });
    if (validation.error) {
      return res.json({ error: validation.error.details[0].message });
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
  if (req.body.newshowimage) {
    await db.query(
      'UPDATE creators_shows SET show_image = ? WHERE user_id = ? ',
      [req.body.newshowimage, who.id]
    );
    return res.json({ status: 'update show image url OK' });
  }
  let change = '';
  if (
    req.body.cname === '' &&
    req.body.cmail === '' &&
    req.body.sname === '' &&
    req.body.sdes === '' &&
    req.body.scategory === 'choose new category'
  ) {
    return res.json({ error: 'nothing change' });
  }
  if (
    req.body.cname === '' &&
    req.body.cmail === '' &&
    req.body.sname === '' &&
    req.body.sdes === '' &&
    req.body.scategory === ''
  ) {
    return res.json({ error: 'nothing change' });
  }
  if (req.body.cname !== '') {
    change += `creator_name = '${req.body.cname}' ,`;
  }
  if (req.body.cmail !== '') {
    validation = Joiput.validate({
      email: req.body.cmail,
    });
    if (validation.error) {
      return res.json({ error: validation.error.details[0].message });
    }
    change += `creator_email = '${req.body.cmail}' ,`;
  }
  if (req.body.sname !== '') {
    change += `show_name = '${req.body.sname}' ,`;
  }
  const category = req.body.scategory;
  if (category !== 'choose new category') {
    const cmain = category.split('_')[0];
    const csub = category.split('_')[1];
    change += `show_category_main = '${cmain}', show_category_sub = '${csub}' ,`;
  }
  if (req.body.sdes !== '') {
    change += `show_des = '${req.body.sdes}' ,`;
  }
  allchange = change.slice(0, change.length - 1);
  const creatorquery =
    'UPDATE creators_shows SET ' + allchange + 'WHERE user_id = ?;';
  const [creatorupdate] = await db.query(creatorquery, [who.id]);
  if (creatorupdate.affectedRows !== 0) {
    const [newcreatorinfo] = await db.query(
      'SELECT * FROM creators_shows WHERE user_id = ?',
      [who.id]
    );
    res.send(newcreatorinfo[0]);
  }
};

module.exports = { userprofile, creatorprofile, updateuser, updatecreator };
