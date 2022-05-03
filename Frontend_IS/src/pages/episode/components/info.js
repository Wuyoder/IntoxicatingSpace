import { EPISODECHOICE } from '../../../global/constants';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../../App';
import { Helmet } from 'react-helmet';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
} from '@mui/material';
const Info = () => {
  const { setEpisodeurl } = useContext(AppContext);
  const [description, setDescription] = useState(true);
  const [info, setInfo] = useState({});
  useEffect(() => {
    //console.log(window.location.pathname.slice(9).split('-')[0]); TODO: show_id
    //console.log(window.location.pathname.slice(9).split('-')[1]); TODO: episode_id
    const getInfo = async () => {
      const res = await axios.get(
        `${EPISODECHOICE}/${window.location.pathname.slice(9).split('-')[0]}-${
          window.location.pathname.slice(9).split('-')[1]
        }`
      );
      setInfo(res.data);
    };
    getInfo();
  }, []);
  const changeplay = () => {
    const play = () => {
      setEpisodeurl(localStorage.getItem('last'));
    };
    play();
  };

  const more = () => {
    document.getElementById('epi_des').style.display = 'block';
    setDescription(false);
  };
  const less = () => {
    document.getElementById('epi_des').style.display = '-webkit-box';
    setDescription(true);
  };

  return (
    <>
      <Helmet>
        <meta property='og:title' content={info.title} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:image' content={info.item?.itunes.image} />
        <meta
          property='og:description'
          content={`listen to all your favorite podcast on Intoxicating.Space!`}
        />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@IntoxicatingSpace' />
        <meta name='twitter:title' content={info.title} />
        <meta
          name='twitter:description'
          content={`listen to all your favorite podcast on Intoxicating.Space!`}
        />
        <meta name='twitter:image' content={info.item?.itunes.image} />
      </Helmet>

      <div className='chat_info'>
        <div className='chat_info_l'>
          <Card variant='outlined' id='episode_choice'>
            <Typography>{info.title}</Typography>

            <div>
              <img
                id='episode_choice_image'
                className='show_image'
                alt={info.title}
                src={info.item?.itunes.image}
              ></img>
            </div>
            <Typography>{info.author}</Typography>
          </Card>
          <div id='play_more_container'>
            <div>
              <Button
                onClick={() => {
                  changeplay();
                  localStorage.setItem('nowplay_title', info.item?.title);
                  localStorage.setItem('nowplay_url', window.location);
                  localStorage.setItem('episode', localStorage.getItem('last'));
                }}
                id='play_btn'
              >
                PLAY
              </Button>
            </div>
            <div>
              {description ? (
                <Button onClick={more} id='more_des_btn'>
                  more
                </Button>
              ) : (
                <Button onClick={less} id='less_des_btn'>
                  less
                </Button>
              )}
            </div>
          </div>
        </div>
        <Card variant='outlined' id='episode_choice_des'>
          <div className='chat_info_r'>
            <Typography>{info.item?.title}</Typography>
            <div className='show_detail' id='epi_des'>
              {document.getElementById('epi_des')
                ? (() => {
                    document.getElementById('epi_des').innerHTML =
                      info.item?.content;
                  })()
                : info.item?.content}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
export default Info;
