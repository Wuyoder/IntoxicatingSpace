import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { SHOWCHOICE, USER_HISTORY } from '../../../global/constants';
import { AppContext } from '../../../App';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
} from '@mui/material';
const ShowEpisode = () => {
  const [episode, setEpisode] = useState([]);
  const { episodeid, setEpisodeid, episodeurl, setEpisodeurl, test } =
    useContext(AppContext);
  useEffect(() => {
    const getEpisode = async () => {
      const res = await axios.get(
        `${SHOWCHOICE}/${window.location.pathname.slice(12)}`
      );
      setEpisode(res.data.items);
    };
    getEpisode();
  }, []);

  return (
    <div className='show_epi_container'>
      {episode.map((item, index) => {
        return (
          <Card variant='outlined' className='episode_card_container'>
            <Link
              to={{
                pathname: `/episode/${window.location.pathname.slice(
                  12
                )}-${index}`,
              }}
              onClick={async () => {
                await axios.post(
                  USER_HISTORY,
                  {
                    type: 'episode',
                    show: window.location.pathname.slice(12),
                    episode: item.guid,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  }
                );

                if (item.guid.indexOf('https://') > -1) {
                  setEpisodeid(
                    item.guid
                      .split('/')
                      [item.guid.split('/').length - 1].split('-')[0]
                  );
                } else {
                  setEpisodeid(item.guid);
                }
                localStorage.setItem('last', item.enclosure?.url);
              }}
              className='episode_card_link'
            >
              <div className='episode_single'>
                <div className='duration_container'>
                  <div className='episode_duration'>
                    {(() => {
                      const modi = item.itunes.duration.toString().indexOf(':');
                      if (modi < 0) {
                        let min = Math.floor(item.itunes.duration / 60);
                        let sec = item.itunes.duration % 60;
                        let modisec;
                        if (sec < 9) {
                          modisec = '0' + sec.toString();
                        } else {
                          modisec = sec;
                        }
                        return `${min}:${modisec}`;
                      } else {
                        return item.itunes.duration;
                      }
                    })()}
                  </div>
                </div>
                <div className='episode_container'>
                  <div className='episode_date'>PubDate ( {item.pubDate} )</div>

                  <div className='episode_title'>{item.title}</div>
                  <div className='episode_play'></div>
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};
export default ShowEpisode;
