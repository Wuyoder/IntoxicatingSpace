const db = require('../util/db');
const { jwtwrap } = require('../util/jwt');
const showkeyword = async (req, res) => {
  //檢查是否成年
  const who = await jwtwrap(req);
  let explicit = '';
  if (who.adult === 0) {
    explicit = ' AND rss_explicit = 0 ';
  }

  const data = req.body;
  if (!data.keyword || data.keyword === ' ') {
    return res.json({ error: 'no keyword' });
  }
  if (data.keyword.indexOf('  ') > -1) {
    return res.json({ error: 'no keyword' });
  }
  const words = data.keyword.split(' ');
  let result = [];
  let muti_search = [];
  let title_search = [];
  let creator_search = [];
  let cate_search = [];
  for (let i = 0; i < words.length; i++) {
    let [search_result] = await db.query(
      `SELECT * FROM rss WHERE ( rss_title like ? || rss_creator like ? || rss_category_main like ? ) ${explicit} AND rss_status = 1 `,
      [`%${words[i]}%`, `%${words[i]}%`, `%${words[i]}%`]
    );
    result.push(search_result);
    let [title_like] = await db.query(
      `SELECT * FROM rss WHERE ( rss_title like ? ) ${explicit} AND rss_status = 1 `,
      [`%${words[i]}%`]
    );
    let [creator_like] = await db.query(
      `SELECT * FROM rss WHERE (rss_creator like ? ) ${explicit} AND rss_status = 1 `,
      [`%${words[i]}%`]
    );
    let [cate_like] = await db.query(
      `SELECT * FROM rss WHERE ( rss_category_main like ? ) ${explicit} AND rss_status = 1 `,
      [`%${words[i]}%`]
    );
    title_search.push(title_like);
    creator_search.push(creator_like);
    cate_search.push(cate_like);
  }
  muti_search.push(title_search.flat());
  muti_search.push(creator_search.flat());
  muti_search.push(cate_search.flat());
  if (muti_search.flat().length == 0) {
    return res
      .status(200)
      .json({ error: 'no match data, please try other keywords.' });
  }
  return res.json({
    title: title_search.flat(),
    creator: creator_search.flat(),
    cate: cate_search.flat(),
  });
};

module.exports = { showkeyword };
