import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  SHOWCHOICE,
  USER_SUBLIST,
  SUB,
  UNSUB,
} from '../../../global/constants';
import { Helmet } from 'react-helmet';
const ShowInfo = () => {
  const [info, setInfo] = useState([]);
  const [originsub, setOriginsub] = useState(false);
  const [mem, setMem] = useState(false);
  const [description, setDescription] = useState(true);
  useEffect(() => {
    const getInfo = async () => {
      const res1 = await axios.get(
        `${SHOWCHOICE}/${window.location.pathname.slice(12)}`
      );
      setInfo(res1.data);
      if (localStorage.getItem('token')) {
        setMem(true);
      }
    };
    const getsub = async () => {
      const res2 = await axios.get(USER_SUBLIST, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const show = window.location.pathname.slice(12);
      if (res2.data.indexOf(Number(show)) < 0) {
        setOriginsub(false);
      } else {
        setOriginsub(true);
      }
    };
    getInfo();
    getsub();
  }, []);

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
  const more = () => {
    document.getElementById('des').style.display = 'block';
    setDescription(false);
  };
  const less = () => {
    document.getElementById('des').style.display = '-webkit-box';
    setDescription(true);
  };

  return (
    <>
      <Helmet>
        <meta property='og:title' content={info.title} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={window.location.href} />
        <meta property='og:image' content={info.itunes?.image} />
        <meta
          property='og:description'
          content={`listen to all your favorite podcast like ${info.title} on Intoxicating.Space!`}
        />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@IntoxicatingSpace' />
        <meta name='twitter:title' content={info.title} />
        <meta
          name='twitter:description'
          content={`listen to all your favorite podcast like ${info.title} on Intoxicating.Space!`}
        />
        <meta name='twitter:image' content={info.itunes?.image} />
      </Helmet>
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
          <div></div>
        </div>
        <div className='show_info_r'>
          <div className='show_des' id='des'>
            {document.getElementById('des')
              ? (() => {
                  document.getElementById('des').innerHTML = info.description;
                })()
              : info.description}
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
          <div>
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
          {mem ? (
            originsub ? (
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
            )
          ) : null}
          <div></div>
        </div>
      </div>
    </>
  );
};
export default ShowInfo;
