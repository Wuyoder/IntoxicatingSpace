const ShowEpisode = ({ items }) => {
  console.log('items');
  console.log('items', items);
  return (
    <>
      {items.map((item) => {
        return (
          <div className='episode'>
            <div>
              <div className='episode_date'>{item.pubDate}</div>
              <div className='episode_title'>{item.title}</div>
              <div className='episode_play'></div>
            </div>
            <div>
              <div className='episode_duration'>{item.itunes.duration}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default ShowEpisode;
