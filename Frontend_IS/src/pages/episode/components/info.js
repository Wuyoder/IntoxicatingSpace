import { EPISODECHOICE } from '../../../global/constants';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../../App';
const Info = () => {
  const { showid, episodeid, episodeurl, setEpisodeurl } =
    useContext(AppContext);

  const Test = () => {
    const { showid, setEpisodeurl } = useContext(AppContext);
    return { showid, setEpisodeurl };
  };

  const [info, setInfo] = useState({});
  useEffect(() => {
    const getInfo = async () => {
      const res = await axios.get(`${EPISODECHOICE}/${showid}-${episodeid}`);
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
  //TODO: html tag to plain text
  return (
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
        <div className='show_detail'>
          {
            (document.getElementsByClassName('show_detail').innerHTML =
              info.item?.content)
          }
        </div>
        <div className='show_sub' Style='display:none'>
          subscribe
        </div>
      </div>
    </div>
  );
};
export default Info;
