import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  SHOWCHOICE,
  USER_SUBLIST,
  SUB,
  UNSUB,
} from '../../../global/constants';

const ShowInfo = () => {
  const [info, setInfo] = useState([]);
  const [originsub, setOriginsub] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      const res1 = await axios.get(
        `${SHOWCHOICE}/${window.location.pathname.slice(12)}`
      );
      setInfo(res1.data);
    };
    const getsub = async () => {
      const res2 = await axios.get(USER_SUBLIST, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const show = window.location.pathname.slice(12);
      if (res2.data.indexOf(Number(show)) < 0) {
        console.log('<0');
        setOriginsub(false);
      } else {
        console.log(res2.data.indexOf(show));
        setOriginsub(true);
      }
    };
    getInfo();
    getsub();
  }, []);
  //showid
  const subclick = async () => {
    setOriginsub(true);
    const subres = await axios.post(
      SUB,
      { id: window.location.pathname.slice(12) },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  };
  const unsubclick = async () => {
    setOriginsub(false);
    const unsubres = await axios.post(
      UNSUB,
      { id: window.location.pathname.slice(12) },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  };

  return (
    <div className='show_info_container'>
      <div className='show_info_l'>
        <div className='show_name'>{info.title}</div>
        <img
          className='show_image_choice'
          alt={info.title}
          src={info.itunes?.image}
        ></img>
        <div className='show_detail'>{info.itunes?.author}</div>
        <div className='show_detail'>{info.itunes?.categories[0]}</div>
      </div>
      <div className='show_info_r'>
        <div className='show_des'>{info.description}</div>
        {originsub ? (
          <button
            id='unsub_btn'
            Style='background-color:black'
            onClick={unsubclick}
          >
            Unsub
          </button>
        ) : (
          <button
            id='sub_btn'
            Style='background-color:black'
            onClick={subclick}
          >
            Sub
          </button>
        )}
        <div id='show_episode'></div>
      </div>
    </div>
  );
};
export default ShowInfo;
