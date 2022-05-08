const db = require('../util/mysql');
const { jwtwrap } = require('../util/jwt');
const showkeyword = async (req, res) => {
  //TODO:檢查是否成年
  const who = await jwtwrap(req);
  console.log(who);
  let explicit = '';
  if (who.adult === 0) {
    explicit = ' AND rss_explicit = 0 ';
  }

  const data = req.body;
  if (!data.keyword) {
    return res.json({ error: 'no keyword' });
  }
  const words = data.keyword.split(' ');
  let result = [];
  for (let i = 0; i < words.length; i++) {
    let [search_result] = await db.query(
      `SELECT * FROM rss WHERE ( rss_title like ? || rss_creator like ? || rss_category_main like ? ) ${explicit} AND rss_status = 1 `,
      [`%${words[i]}%`, `%${words[i]}%`, `%${words[i]}%`]
    );
    result.push(search_result);
  }
  if (result.flat().length == 0) {
    return res
      .status(200)
      .json({ error: 'no match data, please try other keywords.' });
  }
  return res.send(result.flat());
};

module.exports = { showkeyword };
