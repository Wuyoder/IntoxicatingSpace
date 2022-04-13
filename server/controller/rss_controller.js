const db = require('../util/mysql');
const xml = require('xml');

const rssfeed = async (req, res) => {
  const id = req.params.rss;
  const [show_info] = await db.query(
    'SELECT * FROM creators_shows WHERE show_id = ?',
    [id]
  );
  if (!show_info[0]) {
    return res.send('wrong show id');
  }
  const infos = show_info[0];
  if (infos.show_status === 0) {
    return res.send('This show is offline.');
  }
  let explicit;
  if (infos.show_explicit === 0) {
    explicit = 'no';
  } else {
    explicit = 'yes';
  }
  let rss = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" >
  <channel>`;
  rss += `
    <title><![CDATA[${infos.show_name}]]></title>
  <description><![CDATA[${infos.show_des}]]></description>
      <link>https://intoxicating.space/show/${id}</link>
      <image>
          <url>${infos.show_image}</url>
          <title>${infos.show_name}</title>
          <link>${infos.show_image}</link>
      </image>
      <generator>IntoxicatingSpace</generator>
      <lastBuildDate>${infos.show_time_update}</lastBuildDate>
      <atom:link href="https://intoxicating.space/user/show/${id}" rel="self" type="application/rss+xml"/>
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
      </itunes:owner>
    `;
  //   rss += `
  //   <item>
  //     <title><![CDATA[單集節目名稱]]></title>
  //     <description><![CDATA[<p>這裡是單集節目的說明 <br /></p>]]></description>
  //     <link>https://加上後面的ID，這裡是單集節目地址/這裡是這集節目的GUID</link>
  //     <guid isPermaLink="false">這裡是這集節目的GUID</guid>
  //     <dc:creator><![CDATA[podcast製作者creator的名字]]></dc:creator>
  //     <pubDate>Fri, 15 Jan 2021 04:58:35 GMT加入此項RSS內容的時間</pubDate>
  //     <enclosure url="https://節目檔案的位置.mp3" length="28521959節目總byte數" type="audio/mpeg"/>
  //     <itunes:duration>1752節目總秒數</itunes:duration>
  //     <itunes:image href="https://單集封面.png"/>
  //     <googleplay:description><![CDATA[<p>這裡是單集節目的說明 <br /></p>]]></googleplay:description>
  //     <itunes:summary><![CDATA[<p>這裡是單集節目的說明 <br /></p>]]></itunes:summary>
  //     <content:encoded><![CDATA[<p>這裡是單集節目的說明 <br /></p>]]></content:encoded>
  //     <itunes:explicit>no （yes/no決定是否成人內容，單集為yes則會覆蓋此處的no）</itunes:explicit>
  //     <itunes:season>1寫死為第1季（或是不要使用此situational tags）</itunes:season>
  //     <itunes:episode>5自動產生集數（或是不要使用此situational tags）</itunes:episode>
  //     <itunes:episodeType>full</itunes:episodeType>
  // </item>
  //   `;

  rss += `</channel></rss>`;
  //return res.send(show_info);
  return res.header('Content-Type', 'application/xml').send(rss);
};

module.exports = { rssfeed };
