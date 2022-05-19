const { jwtwrap } = require('../util/jwt');
const { search } = require('../model/search_model');
const showKeyword = async (req, res) => {
  const who = await jwtwrap(req);
  let explicit = '';
  if (who.adult === 0) {
    explicit = ' AND rss_explicit = 0 ';
  }
  const data = req.body;
  if (!data.keyword || data.keyword === ' ') {
    return res.status(200).json({ error: 'no keyword' });
  }
  if (data.keyword.indexOf('  ') > -1) {
    return res.status(200).json({ error: 'no keyword' });
  }
  const words = data.keyword.split(' ');
  let mutiSearch = [];
  let titleSearch = [];
  let creatorSearch = [];
  let cateSearch = [];
  for (let i = 0; i < words.length; i++) {
    let titleLike = await search('rss_title', explicit, words[i]);
    let creatorLike = await search('rss_creator', explicit, words[i]);
    let cateLike = await search('rss_category_main', explicit, words[i]);
    titleSearch.push(titleLike);
    creatorSearch.push(creatorLike);
    cateSearch.push(cateLike);
  }
  mutiSearch.push(titleSearch.flat());
  mutiSearch.push(creatorSearch.flat());
  mutiSearch.push(cateSearch.flat());
  if (mutiSearch.flat().length == 0) {
    return res
      .status(200)
      .json({ error: 'no match data, please try other keywords.' });
  }
  return res.status(200).json({
    title: titleSearch.flat(),
    creator: creatorSearch.flat(),
    cate: cateSearch.flat(),
  });
};

module.exports = { showKeyword };
