import { EPISODECHOICE } from '../../../global/constants';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../../App';
import { Helmet } from 'react-helmet';
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
          <div className='show_detail'>{info.title}</div>
          <div>
            <img
              className='show_image'
              alt={info.title}
              src={info.item?.itunes.image}
            ></img>
          </div>
          <div className='show_detail'>{info.author}</div>
          <div>
            <button
              Style='background-color:black'
              onClick={() => {
                changeplay();
                localStorage.setItem('episode', localStorage.getItem('last'));
              }}
              className='btn_type'
            >
              PLAY
            </button>
          </div>
        </div>
        <div className='chat_info_r'>
          <div className='show_detail' id='epi_des'>
            {document.getElementById('epi_des')
              ? (() => {
                  document.getElementById('epi_des').innerHTML =
                    info.item?.content;
                })()
              : info.item?.content}
          </div>
          {description ? (
            <button onClick={more} Style='background-color:black'>
              more
            </button>
          ) : (
            <button onClick={less} Style='background-color:black'>
              less
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default Info;
