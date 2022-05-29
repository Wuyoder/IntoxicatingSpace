const cru = require('../model/cru_model');
const { rssEpi } = require('../model/rss_model');

const rssFeed = async (req, res) => {
  const id = req.params.rss;
  const show_info = await cru.select('creators_shows', ['*'], { show_id: id });
  if (!show_info[0]) {
    return res.status(200).json({ error: 'wrong rss url' });
  }
  const infos = show_info[0];
  if (infos.show_status === 0) {
    return res.status(200).json({ error: 'This show is offline' });
  }
  const episodeInfo = await rssEpi(id);

  if (!episodeInfo[0]) {
    return res.status(200).json({ error: 'This show (episode) is offline' });
  }
  const rssId = await cru.select('rss', ['*'], {
    rss_title: show_info[0].show_name,
  });

  let items = '';
  let explicit;
  // check each episode's explicit to rewrite show detail
  for (let i = 0; i < episodeInfo.length; i++) {
   const explicit = (episodeInfo[i].episode_explicit === 0) ? 'no' : 'yes';
    let basic = episodeInfo[i].episode_publish_date
      .toString()
      .replace('+0800 (台北標準時間)', '');
    //format db timestamp to rss timestamp
    const timeformat =
      basic.slice(0, 3) +
      ',' +
      basic.slice(7, 10) +
      basic.slice(3, 7) +
      basic.slice(10, 28);
    items += `<item>
      <title><![CDATA[${episodeInfo[i].episode_title}]]></title>
      <description><![CDATA[${episodeInfo[i].episode_des}]]></description>
      <link>https://intoxicating.space/episode/${rssId[0].rss_id}-${i}</link>
      <guid isPermaLink="false">${episodeInfo[i].episode_id}</guid>
      <dc:creator><![CDATA[${infos.creator_name}]]></dc:creator>
      <pubDate>${timeformat}</pubDate>
      <enclosure url="${episodeInfo[i].episode_file}" length="${episodeInfo[i].episode_length}" type="audio/mpeg"/>
      <itunes:duration>${episodeInfo[i].episode_duration}</itunes:duration>
      <itunes:image href="${episodeInfo[i].episode_image}"/>
      <googleplay:description><![CDATA[${episodeInfo[i].episode_des}]]></googleplay:description>
      <itunes:summary><![CDATA[${episodeInfo[i].episode_des}]]></itunes:summary>
      <content:encoded><![CDATA[${episodeInfo[i].episode_des}]]></content:encoded>
      <itunes:explicit>${explicit}</itunes:explicit>
      <itunes:season>1</itunes:season>
      <itunes:episode>${episodeInfo[i].episode_episode}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
  </item>`;
  }
  let last = episodeInfo[0].episode_publish_date
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
      <link>https://intoxicating.space/showchoice/${rssId[0].rss_id}</link>
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
  return res.status(200).header('Content-Type', 'application/xml').send(rss);
};

module.exports = { rssFeed };
