const db = require('../util/mysql');

const showkeyword = async (req, res) => {
  //TODO:檢查是否成年
  const data = req.body;
  if (!data.keyword) {
    return res.json({ error: 'no keyword' });
  }
  const words = data.keyword.split(' ');
  let result = [];
  for (let i = 0; i < words.length; i++) {
    let [search_result] = await db.query(
      `SELECT * FROM rss WHERE rss_title like ? || rss_creator like ? || rss_category_main like ?`,
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
