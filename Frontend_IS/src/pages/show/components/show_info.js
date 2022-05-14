import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  SHOWCHOICE,
  USER_SUBLIST,
  SUB,
  UNSUB,
} from '../../../global/constants';
import { Helmet } from 'react-helmet';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Step from '../../step/steps';
import Loading from '../../loading/loading';

const ShowInfo = () => {
  const [info, setInfo] = useState([]);
  const [originsub, setOriginsub] = useState(false);
  const [mem, setMem] = useState(false);
  const [showon, setShowon] = useState(true);
  const [load, setLoad] = useState(true);
  useEffect(() => {
    const getInfo = async () => {
      const res1 = await axios.get(
        `${SHOWCHOICE}/${window.location.pathname.slice(12)}`
      );

      setInfo(res1.data);
      if (res1.data.error) {
        setShowon(false);
      } else {
        setShowon(true);
      }
      if (localStorage.getItem('token')) {
        setMem(true);
      }
    };
    const getsub = async () => {
      const res2 = await axios
        .get(USER_SUBLIST, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => {
          setLoad(false);
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

  return showon ? (
    load ? (
      <div Style='margin:30vh 0 30vh 35vw'>
        <Loading />
      </div>
    ) : (
      <>
        <Step.StepShowchoice />
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
            <Card variant='outlined' id='show_info_l'>
              <CardContent>
                <Typography
                  variant='body1'
                  color='text.primary'
                  id='show_card_title'
                >
                  {info.title}
                </Typography>
                <img
                  className='show_image_choice'
                  alt={info.title}
                  src={info.itunes?.image}
                ></img>
                <Typography
                  variant='body1'
                  color='text.primary'
                  id='show_card_author'
                >
                  {info.itunes?.author}
                </Typography>
                <Typography
                  variant='body1'
                  color='text.primary'
                  id='show_card_cate'
                >
                  {info.itunes?.categories[0]}
                </Typography>
              </CardContent>
            </Card>
            <div id='sub_more_container'>
              <div id='sub_container'>
                {mem ? (
                  originsub ? (
                    <Button id='unsub_btn' onClick={unsubclick}>
                      Unsub
                    </Button>
                  ) : (
                    <Button id='sub_btn' onClick={subclick}>
                      Sub
                    </Button>
                  )
                ) : null}
              </div>
            </div>
          </div>
          <div className='show_info_r'>
            <Card variant='outlined' id='show_info_r'>
              <div className='show_des' id='des'></div>
            </Card>
          </div>
        </div>
        {(() => {
          if (info.description !== undefined) {
            document.getElementById('des').innerHTML = info.description;
          }
        })()}
      </>
    )
  ) : (
    <div id='offline_show' Style='padding:2vw; font-size:2em'>
      This Podcast Temporarily Offline.
    </div>
  );
};
export default ShowInfo;
