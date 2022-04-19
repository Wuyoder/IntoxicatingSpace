import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { SHOW } from '../../../global/constants';
import { AppContext } from '../../../App';
const ShowEpisode = () => {
  const [episode, setEpisode] = useState([]);
  const { showid, episodeid, setEpisodeid, episodeurl, setEpisodeurl, test } =
    useContext(AppContext);
  useEffect(() => {
    const getEpisode = async () => {
      const res = await axios.get(`${SHOW}/${showid}`);
      setEpisode(res.data.items);
    };
    getEpisode();
  }, []);

  return (
    <>
      {episode.map((item, index) => {
        return (
          <div className='episode'>
            <div>
              <div className='episode_date'>{item.pubDate}</div>
              <Link
                to='/episode'
                onClick={() => {
                  setEpisodeid(index);
                  localStorage.setItem('last', item.enclosure?.url);
                }}
              >
                <div className='episode_title'>{item.title}</div>
              </Link>
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
