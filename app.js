const express = require('express');
const xml = require('xml');
const app = express();
const port = 3000;
app.use(express.static('./public'));

app.get('/', (req, res) => {
  console.log('hihi');
  res.send('hihi');
});
// app.get('/play',(req,res))

app.get('/rss', (req, res) => {
  const rss = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:psc="https://podlove.org/simple-chapters/" xmlns:kkbox="https://podcast.kkbox.com/">
    <channel>
        <title><![CDATA[La-Ji-Ooh | 工程師的拉機話，大家聽的 Radio]]></title>
        <description><![CDATA[<p>你是否覺得自己講話很有趣，卻沒有人懂？ <br />又或是你想要參與 Podcast 節目的錄製，但是有點懶得後製？ <br />歡迎你來我們的節目一起聊聊吧，想了解更多細節請私訊我們的 Instagram 帳號～ <br />https://www.instagram.com/lajiooh.podcast/ <br /> <br />兩位主人翁與你聊軟體、聊職涯、聊創新、聊現象、啥都聊。 <br /> <br />Leo：剛出社會，便快速融入社畜生活的工程師。 <br />Hinrick：從人資轉職剛滿一年半的工程師。 <br />歡迎大家跟著我們，從社會新鮮人/軟體工程師的角度看待這個社會以及自己的自我成長。 <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a></p>]]></description>
        <link>https://la-ji-ooh.firstory.io</link>
        <image>
            <url>https://d3mww1g1pfq2pt.cloudfront.net/Avatar/ckb7euvf7yro308734fynbk9m/1592622947041.jpg</url>
            <title>La-Ji-Ooh | 工程師的拉機話，大家聽的 Radio</title>
            <link>https://la-ji-ooh.firstory.io</link>
        </image>
        <generator>Firstory</generator>
        <lastBuildDate>Mon, 07 Feb 2022 14:53:11 GMT</lastBuildDate>
        <atom:link href="https://open.firstory.me/rss/user/ckb7euvf7yro308734fynbk9m" rel="self" type="application/rss+xml"/>
        <pubDate>Tue, 09 Jun 2020 04:15:06 GMT</pubDate>
        <copyright><![CDATA[Leo, Hinrick]]></copyright>
        <language><![CDATA[zh]]></language>
        <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
        <category><![CDATA[Self-Improvement]]></category>
        <googleplay:author><![CDATA[Leo, Hinrick]]></googleplay:author>
        <googleplay:description><![CDATA[<p>你是否覺得自己講話很有趣，卻沒有人懂？ <br />又或是你想要參與 Podcast 節目的錄製，但是有點懶得後製？ <br />歡迎你來我們的節目一起聊聊吧，想了解更多細節請私訊我們的 Instagram 帳號～ <br />https://www.instagram.com/lajiooh.podcast/ <br /> <br />兩位主人翁與你聊軟體、聊職涯、聊創新、聊現象、啥都聊。 <br /> <br />Leo：剛出社會，便快速融入社畜生活的工程師。 <br />Hinrick：從人資轉職剛滿一年半的工程師。 <br />歡迎大家跟著我們，從社會新鮮人/軟體工程師的角度看待這個社會以及自己的自我成長。 <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a></p>]]></googleplay:description>
        <googleplay:image href="https://d3mww1g1pfq2pt.cloudfront.net/Avatar/ckb7euvf7yro308734fynbk9m/1592622947041.jpg"/>
        <itunes:author><![CDATA[Leo, Hinrick]]></itunes:author>
        <itunes:summary><![CDATA[<p>你是否覺得自己講話很有趣，卻沒有人懂？ <br />又或是你想要參與 Podcast 節目的錄製，但是有點懶得後製？ <br />歡迎你來我們的節目一起聊聊吧，想了解更多細節請私訊我們的 Instagram 帳號～ <br />https://www.instagram.com/lajiooh.podcast/ <br /> <br />兩位主人翁與你聊軟體、聊職涯、聊創新、聊現象、啥都聊。 <br /> <br />Leo：剛出社會，便快速融入社畜生活的工程師。 <br />Hinrick：從人資轉職剛滿一年半的工程師。 <br />歡迎大家跟著我們，從社會新鮮人/軟體工程師的角度看待這個社會以及自己的自我成長。 <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a></p>]]></itunes:summary>
        <itunes:image href="https://d3mww1g1pfq2pt.cloudfront.net/Avatar/ckb7euvf7yro308734fynbk9m/1592622947041.jpg"/>
        <itunes:owner>
            <itunes:name><![CDATA[Leo, Hinrick]]></itunes:name>
            <itunes:email>v10110wwe@gmail.com</itunes:email>
        </itunes:owner>
        <itunes:category text="Education">
            <itunes:category text="Self-Improvement"/>
        </itunes:category>
        <itunes:explicit>no</itunes:explicit>
        <itunes:keywords>967691</itunes:keywords>
        <item>
            <title><![CDATA[S2EP9. [Podcast 聊聊天] 遠距工作者在台灣的生活樣態 (下) feat. 劉艾霖]]></title>
            <description><![CDATA[<p>防疫期間，很多人的遠距工作已經滿一個月，除了漸漸習慣這種工作模式外，也開始衍生了一些溝通上的問題，本集節目中，除了遠端工作的生活樣態、自我學習之外，有豐富的遠端管理經驗的 <br />A-lin ，將與我們分享在遠端工作的過程中，向下管理以及向上管理的技巧。 <br /> <br />追蹤一下 👉🏻 遠距工作者在台灣：https://www.facebook.com/groups/1190343134374259/ <br /> <br /> <br />劉艾霖過往演講 <br /> <br />遠距工作者的一堂課：https://slides.com/alincode/20190427-remotely/ <br /> <br />遠距工作者生存手冊共筆文件：https://hackmd.io/@mopcon/2020/%2F%40mopcon%2FS1vE9Yrvw <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a></p>]]></description>
            <link>https://open.firstory.me/story/ckqf0qyklrhre0930mmkdwsjb</link>
            <guid isPermaLink="false">ckqf0qyklrhre0930mmkdwsjb</guid>
            <dc:creator><![CDATA[Leo, Hinrick]]></dc:creator>
            <pubDate>Wed, 30 Jun 2021 09:45:30 GMT</pubDate>
            <enclosure url="https://backend.endpoints.firstory-709db.cloud.goog/play.mp3?url=https%3A%2F%2Fstorage.googleapis.com%2Ffirstory-709db.appspot.com%2FRecord%2Fckb7euvf7yro308734fynbk9m%2F1624787862451.mp3%3Fv%3D1624787873111" length="94469796" type="audio/mpeg"/>
            <content:encoded><![CDATA[<p>防疫期間，很多人的遠距工作已經滿一個月，除了漸漸習慣這種工作模式外，也開始衍生了一些溝通上的問題，本集節目中，除了遠端工作的生活樣態、自我學習之外，有豐富的遠端管理經驗的 A-lin ，將與我們分享在遠端工作的過程中，向下管理以及向上管理的技巧。<br /><br />追蹤一下 👉🏻 遠距工作者在台灣：https://www.facebook.com/groups/1190343134374259/<br /><br /><br />劉艾霖過往演講<br /><br />遠距工作者的一堂課：https://slides.com/alincode/20190427-remotely/<br /><br />遠距工作者生存手冊共筆文件：https://hackmd.io/@mopcon/2020/%2F%40mopcon%2FS1vE9Yrvw</p> <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a>]]></content:encoded>
            <googleplay:description><![CDATA[<p>防疫期間，很多人的遠距工作已經滿一個月，除了漸漸習慣這種工作模式外，也開始衍生了一些溝通上的問題，本集節目中，除了遠端工作的生活樣態、自我學習之外，有豐富的遠端管理經驗的 <br />A-lin ，將與我們分享在遠端工作的過程中，向下管理以及向上管理的技巧。 <br /> <br />追蹤一下 👉🏻 遠距工作者在台灣：https://www.facebook.com/groups/1190343134374259/ <br /> <br /> <br />劉艾霖過往演講 <br /> <br />遠距工作者的一堂課：https://slides.com/alincode/20190427-remotely/ <br /> <br />遠距工作者生存手冊共筆文件：https://hackmd.io/@mopcon/2020/%2F%40mopcon%2FS1vE9Yrvw <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a></p>]]></googleplay:description>
            <itunes:summary><![CDATA[<p>防疫期間，很多人的遠距工作已經滿一個月，除了漸漸習慣這種工作模式外，也開始衍生了一些溝通上的問題，本集節目中，除了遠端工作的生活樣態、自我學習之外，有豐富的遠端管理經驗的 <br />A-lin ，將與我們分享在遠端工作的過程中，向下管理以及向上管理的技巧。 <br /> <br />追蹤一下 👉🏻 遠距工作者在台灣：https://www.facebook.com/groups/1190343134374259/ <br /> <br /> <br />劉艾霖過往演講 <br /> <br />遠距工作者的一堂課：https://slides.com/alincode/20190427-remotely/ <br /> <br />遠距工作者生存手冊共筆文件：https://hackmd.io/@mopcon/2020/%2F%40mopcon%2FS1vE9Yrvw <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a></p>]]></itunes:summary>
            <itunes:duration>2361</itunes:duration>
            <itunes:image href="https://d3mww1g1pfq2pt.cloudfront.net/Avatar/ckb7euvf7yro308734fynbk9m/1592622947041.jpg"/>
            <itunes:explicit>no</itunes:explicit>
            <itunes:season>2</itunes:season>
            <itunes:episode>9</itunes:episode>
            <itunes:episodeType>full</itunes:episodeType>
        </item>
        <item>
            <title><![CDATA[S2EP8. [Podcast 聊聊天] 遠距工作者在台灣的生活樣態 (中) feat. 劉艾霖]]></title>
            <description><![CDATA[<p>防疫期間，許多人的工作型態也轉為遠距工作、異地辦公的模式。 <br />本集節目中，我們繼續請劉艾霖 (A-lin) 與我們分享遠距工作者的故事，由於許多的遠端團隊需要跨國溝通，因此英文就變成了一項非常重要的技能，究竟 A-lin <br />過去是如何學習英文並應用於工作上的呢？除此之外，遠距工作的生活開銷與一般型態的工作又有什麼不同，以及全遠距、半遠距的工作差異又在哪邊，我們都將在這集一一為大家解答。 <br /> <br />追蹤一下 👉🏻 遠距工作者在台灣：https://www.facebook.com/groups/1190343134374259/ <br /> <br />劉艾霖過往演講 <br />遠距工作者的一堂課：https://slides.com/alincode/20190427-remotely/ <br />遠距工作者生存手冊共筆文件：https://hackmd.io/@mopcon/2020/%2F%40mopcon%2FS1vE9Yrvw <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a></p>]]></description>
            <link>https://open.firstory.me/story/ckp2swso4llmo08009lfl71kx</link>
            <guid isPermaLink="false">ckp2swso4llmo08009lfl71kx</guid>
            <dc:creator><![CDATA[Leo, Hinrick]]></dc:creator>
            <pubDate>Tue, 25 May 2021 09:30:09 GMT</pubDate>
            <enclosure url="https://backend.endpoints.firstory-709db.cloud.goog/play.mp3?url=https%3A%2F%2Fstorage.googleapis.com%2Ffirstory-709db.appspot.com%2FRecord%2Fckb7euvf7yro308734fynbk9m%2F1621872319083.mp3%3Fv%3D1621872332010" length="127045476" type="audio/mpeg"/>
            <content:encoded><![CDATA[<p>防疫期間，許多人的工作型態也轉為遠距工作、異地辦公的模式。<br />本集節目中，我們繼續請劉艾霖 (A-lin) 與我們分享遠距工作者的故事，由於許多的遠端團隊需要跨國溝通，因此英文就變成了一項非常重要的技能，究竟 A-lin 過去是如何學習英文並應用於工作上的呢？除此之外，遠距工作的生活開銷與一般型態的工作又有什麼不同，以及全遠距、半遠距的工作差異又在哪邊，我們都將在這集一一為大家解答。<br /><br />追蹤一下 👉🏻 遠距工作者在台灣：https://www.facebook.com/groups/1190343134374259/<br /><br />劉艾霖過往演講<br />遠距工作者的一堂課：https://slides.com/alincode/20190427-remotely/<br />遠距工作者生存手冊共筆文件：https://hackmd.io/@mopcon/2020/%2F%40mopcon%2FS1vE9Yrvw</p> <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a>]]></content:encoded>
            <googleplay:description><![CDATA[<p>防疫期間，許多人的工作型態也轉為遠距工作、異地辦公的模式。 <br />本集節目中，我們繼續請劉艾霖 (A-lin) 與我們分享遠距工作者的故事，由於許多的遠端團隊需要跨國溝通，因此英文就變成了一項非常重要的技能，究竟 A-lin <br />過去是如何學習英文並應用於工作上的呢？除此之外，遠距工作的生活開銷與一般型態的工作又有什麼不同，以及全遠距、半遠距的工作差異又在哪邊，我們都將在這集一一為大家解答。 <br /> <br />追蹤一下 👉🏻 遠距工作者在台灣：https://www.facebook.com/groups/1190343134374259/ <br /> <br />劉艾霖過往演講 <br />遠距工作者的一堂課：https://slides.com/alincode/20190427-remotely/ <br />遠距工作者生存手冊共筆文件：https://hackmd.io/@mopcon/2020/%2F%40mopcon%2FS1vE9Yrvw <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a></p>]]></googleplay:description>
            <itunes:summary><![CDATA[<p>防疫期間，許多人的工作型態也轉為遠距工作、異地辦公的模式。 <br />本集節目中，我們繼續請劉艾霖 (A-lin) 與我們分享遠距工作者的故事，由於許多的遠端團隊需要跨國溝通，因此英文就變成了一項非常重要的技能，究竟 A-lin <br />過去是如何學習英文並應用於工作上的呢？除此之外，遠距工作的生活開銷與一般型態的工作又有什麼不同，以及全遠距、半遠距的工作差異又在哪邊，我們都將在這集一一為大家解答。 <br /> <br />追蹤一下 👉🏻 遠距工作者在台灣：https://www.facebook.com/groups/1190343134374259/ <br /> <br />劉艾霖過往演講 <br />遠距工作者的一堂課：https://slides.com/alincode/20190427-remotely/ <br />遠距工作者生存手冊共筆文件：https://hackmd.io/@mopcon/2020/%2F%40mopcon%2FS1vE9Yrvw <br /> <br/>Powered by <a href="https://firstory.me">Firstory Hosting</a></p>]]></itunes:summary>
            <itunes:duration>3176</itunes:duration>
            <itunes:image href="https://d3mww1g1pfq2pt.cloudfront.net/Avatar/ckb7euvf7yro308734fynbk9m/1592622947041.jpg"/>
            <itunes:explicit>no</itunes:explicit>
            <itunes:season>2</itunes:season>
            <itunes:episode>8</itunes:episode>
            <itunes:episodeType>full</itunes:episodeType>
        </item>
            </channel>
</rss>`;

  res.header('Content-Type', 'application/xml').send(rss);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
