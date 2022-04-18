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
      const res = await axios.get(
        `http://localhost:3001/api/1.0/user/episodechoice/${showid}-${episodeid}`
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
  return (
    <div className='show' id='show_details'>
      <div className='show_info' id='show_ifo'>
        <img
          className='show_image'
          alt={info.title}
          src={info.item?.itunes.image}
        ></img>
        <button
          Style='background-color:black'
          onClick={(event) => {
            changeplay();
            localStorage.setItem('episode', localStorage.getItem('last'));
          }}
        >
          PLAY
        </button>
        <div className='show_detail'>{info.title}</div>
        <div className='show_detail'>{info.item?.itunes.explicit}</div>
        <div className='show_detail'>{info.author}</div>
        <div className='show_detail'>{info.item?.content}</div>
        <div className='show_sub'>subscribe</div>
      </div>
    </div>
  );
};
export default Info;
