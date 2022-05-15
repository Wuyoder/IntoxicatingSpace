import { useContext } from 'react';
import { AppContext } from '../../../App';
import { Helmet } from 'react-helmet';
import { Button, Card, Typography } from '@mui/material';

const Info = ({ info }) => {
  const { setEpisodeurl, audio } = useContext(AppContext);

  const changeplay = () => {
    const play = () => {
      setEpisodeurl(localStorage.getItem('last'));
    };
    play();
    const audioTarget = document.querySelector('.rhap_main');
    audioTarget.style.display = 'block';
    const nowPlay = document.getElementById('nowplay_btn');
    nowPlay.style.display = 'block';
  };
  const destext = () => {
    return { __html: info.item.content };
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
                  localStorage.setItem('episode', localStorage.getItem('last'));
                  localStorage.setItem('nowplay_title', info.item?.title);
                  localStorage.setItem(
                    'nowplay_url',
                    window.location.pathname.split('/')[2]
                  );
                  audio.play();
                }}
                id='play_btn'
              >
                PLAY
              </Button>
            </div>
            <div></div>
          </div>
        </div>
        <Card variant='outlined' id='episode_choice_des'>
          <div className='chat_info_r'>
            <Typography>{info.item?.title}</Typography>
            <div
              className='show_detail'
              id='epi_des'
              dangerouslySetInnerHTML={destext()}
            ></div>
          </div>
        </Card>
      </div>
      {}
    </>
  );
};
export default Info;
