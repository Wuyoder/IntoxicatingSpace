import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SHOWCHOICE, USER_HISTORY } from '../../../global/constants';
import { AppContext } from '../../../App';
import { Card } from '@mui/material';
import ajax from '../../../util/ajax';
const ShowEpisode = () => {
  const [episode, setEpisode] = useState([]);
  const { setEpisodeid } = useContext(AppContext);
  const [noepi, setNoepi] = useState(false);
  useEffect(() => {
    const getEpisode = async () => {
      const res = await ajax(
        'get',
        `${SHOWCHOICE}/${window.location.pathname.split('/')[2]}`
      );
      if (res.data.error) {
        setNoepi(false);
      } else {
        setNoepi(true);
        setEpisode(res.data.items);
      }
    };
    getEpisode();
  }, []);

  return (
    <div className='show_epi_container'>
      {noepi
        ? episode.map((item, index) => {
            return (
              <Card
                variant='outlined'
                className='episode_card_container'
                key={`episode${index}`}
              >
                <Link
                  to={{
                    pathname: `/episode/${
                      window.location.pathname.split('/')[2]
                    }-${index}`,
                  }}
                  onClick={async () => {
                    await ajax('post', USER_HISTORY, {
                      type: 'episode',
                      show: window.location.pathname.split('/')[2],
                      episode: item.guid,
                    });
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
                          const modi = item.itunes.duration
                            .toString()
                            .indexOf(':');
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
                      <div className='episode_date'>
                        PubDate ( {item.pubDate} )
                      </div>

                      <div className='episode_title'>{item.title}</div>
                      <div className='episode_play'></div>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })
        : null}
    </div>
  );
};
export default ShowEpisode;
