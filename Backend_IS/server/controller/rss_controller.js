const db = require('../util/mysql');
const xml = require('xml');
const rssfeed = async (req, res) => {
  //目標確定show uuid
  const id = req.params.rss;
  //取得show data
  const [show_info] = await db.query(
    'SELECT * FROM creators_shows WHERE show_id = ?',
    [id]
  );
  if (!show_info[0]) {
    return res.status(200).json({ error: 'wrong rss url' });
  }
  const infos = show_info[0];
  if (infos.show_status === 0) {
    return res.status(200).json({ error: 'This show is offline' });
  }
  //取得所有單集episode data , for loop
  const [episode_info] = await db.query(
    'SELECT * FROM episodes WHERE show_id = ? && episode_status = 1 ORDER BY episode_publish_date DESC',
    [id]
  );
  if (!episode_info[0]) {
    return res.status(200).json({ error: 'This show (episode) is offline' });
  }
  const [rss_id] = await db.query('SELECT * FROM rss WHERE rss_title = ?', [
    show_info[0].show_name,
  ]);
  let items = '';
  let explicit;
  for (let i = 0; i < episode_info.length; i++) {
    if (episode_info[i].episode_explicit === 0) {
      explicit = 'no';
    } else {
      explicit = 'yes';
    }
    let basic = episode_info[i].episode_publish_date
      .toString()
      .replace('+0800 (台北標準時間)', '');
    const timeformat =
      basic.slice(0, 3) +
      ',' +
      basic.slice(7, 10) +
      basic.slice(3, 7) +
      basic.slice(10, 28);
    items += `<item>
      <title><![CDATA[${episode_info[i].episode_title}]]></title>
      <description><![CDATA[${episode_info[i].episode_des}]]></description>
      <link>https://intoxicating.space/episode/${rss_id[0].rss_id}-${i}</link>
      <guid isPermaLink="false">${episode_info[i].episode_id}</guid>
      <dc:creator><![CDATA[${infos.creator_name}]]></dc:creator>
      <pubDate>${timeformat}</pubDate>
      <enclosure url="${episode_info[i].episode_file}" length="${episode_info[i].episode_length}" type="audio/mpeg"/>
      <itunes:duration>${episode_info[i].episode_duration}</itunes:duration>
      <itunes:image href="${episode_info[i].episode_image}"/>
      <googleplay:description><![CDATA[${episode_info[i].episode_des}]]></googleplay:description>
      <itunes:summary><![CDATA[${episode_info[i].episode_des}]]></itunes:summary>
      <content:encoded><![CDATA[${episode_info[i].episode_des}]]></content:encoded>
      <itunes:explicit>${episode_info[i].episode_explicit}</itunes:explicit>
      <itunes:season>1</itunes:season>
      <itunes:episode>${episode_info[i].episode_episode}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
  </item>`;
  }
  let last = episode_info[0].episode_publish_date
    .toString()
    .replace('+0800 (台北標準時間)', '');
  const lasttimeformat =
    last.slice(0, 3) +
    ',' +
    last.slice(7, 10) +
    last.slice(3, 7) +
    last.slice(10, 28);

  let rss = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" >
  <channel>`;
  rss += `
    <title><![CDATA[${infos.show_name}]]></title>
  <description><![CDATA[${infos.show_des}]]></description>
      <link>https://intoxicating.space/showchoice/${rss_id[0].rss_id}</link>
      <image>
          <url>${infos.show_image}</url>
          <title>${infos.show_name}</title>
          <link>${infos.show_image}</link>
      </image>
      <generator>IntoxicatingSpace</generator>
      <lastBuildDate>${lasttimeformat}</lastBuildDate>
      <atom:link href="https://intoxicating.space/api/1.0/user/rss/${id}" rel="self" type="application/rss+xml"/>
      <copyright><![CDATA[${infos.creator_name}]]></copyright>
      <language><![CDATA[zh]]></language>
      <category><![CDATA[${infos.show_category_main}]]></category>
      <googleplay:description><![CDATA[${infos.show_des}]]></googleplay:description>
      <itunes:summary><![CDATA[${infos.show_des}]]></itunes:summary>
      <googleplay:image href="${infos.show_image}"/>
      <itunes:image href="${infos.show_image}"/>
      <itunes:type>episodic</itunes:type>
      <itunes:explicit>${explicit}</itunes:explicit>
      <itunes:category text="${infos.show_category_main}">`;
  if (infos.show_category_main !== infos.show_category_sub) {
    rss += `<itunes:category text="${infos.show_category_sub}"/>`;
  }
  rss += `
      </itunes:category>
      <googleplay:author><![CDATA[${infos.creator_name}]]></googleplay:author>
      <itunes:author><![CDATA[${infos.creator_name}]]></itunes:author>
      <itunes:owner>
          <itunes:name><![CDATA[${infos.creator_name}]]></itunes:name>
          <itunes:email>${infos.creator_email}</itunes:email>
      </itunes:owner>`;
  rss += items;
  rss += `</channel></rss>`;

  return res.header('Content-Type', 'application/xml').send(rss);
};

module.exports = { rssfeed };
