import { NavLink, Link } from 'react-router-dom';
import { COUNTER_LOGINS, SEARCH } from '../global/constants';
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AppContext } from '../App';
import { Button, TextField } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const Withyou = () => {
  const MySwal = withReactContent(Swal);

  MySwal.fire({
    title: (
      <>
        <h4 className='alert'>Keep Looking.</h4>
        <h4> Don't settle.</h4>
      </>
    ),
    didOpen: () => {
      // `MySwal` is a subclass of `Swal` with all the same instance & static methods
      //MySwal.showLoading();
    },
  });
  // .then(() => {
  //   return MySwal.fire(
  //     <>
  //       <h1 className='alert'>Keep Looking.</h1>
  //       <br />
  //       <h1> Don't settle.</h1>
  //     </>
  //   );
  // }
  //);
  const [counterlogins, setCounterlogins] = useState(0);

  useEffect(() => {
    const getCounter = async () => {
      const res = await axios.get(COUNTER_LOGINS, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCounterlogins(res.data.status);
    };
    getCounter();
  }, []);

  if (counterlogins > 0) {
    return <>with you {counterlogins} days and nights.</>;
  }
  if (!counterlogins) {
    return <></>;
  }
};

const Topbar = () => {
  const { search, setSearch, podcastplayer, audio } = useContext(AppContext);
  const gosearch = async () => {
    if (document.getElementById('search_input').value !== '') {
      const res = await axios.post(SEARCH, {
        keyword: document.getElementById('search_input').value,
      });
      document.getElementById('search_input').value = '';
      if (res.data.error !== 'no keyword') {
        setSearch(res.data);
      } else {
        setSearch({ error: 'no keyword' });
      }
    }
  };
  const enter = (e) => {
    let keyword = document.getElementById('search_input').value;
    if (e.key === 'Enter' && keyword !== '') {
      document.getElementById('search_btn').click();
    }
  };

  //  <div>
  //    <img
  //      id='main_logo'
  //      alt='main_logo'
  //      src='https://intoxicating.s3.ap-northeast-1.amazonaws.com/IS_LOGO.png'
  //    ></img>
  //  </div>;

  return (
    <div id='topbar'>
      <div className='withyou'>
        <p className='withyou'>
          Intoxicating Space <Withyou />
        </p>
      </div>
      <Link
        to={`/episode/${localStorage.getItem('nowplay_url')}`}
        id='now_link'
      >
        <div id='nowplay_btn'>
          {(() => {
            if (localStorage.getItem('nowplay_title') !== 'undefined') {
              return localStorage.getItem('nowplay_title');
            } else {
              return null;
            }
          })()}
        </div>
      </Link>
      <div className='search_container'>
        <div className='search_item'>
          <TextField
            className='topbarinput'
            label='Keyword'
            variant='outlined'
            id='search_input'
            onKeyDown={enter}
          ></TextField>
        </div>
        <div className='search_item'>
          <NavLink to='/search' Style='text-decoration:none'>
            <Button
              variant='contained'
              id='search_btn'
              onClick={gosearch}
              className='search_btn'
            >
              Search
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

let activeStyle = {
  color: 'darkcyan',
};

const Sidebar = ({ member }) => {
  const gologout = () => {
    localStorage.clear();
    alert('SeeYa');
    window.location.replace('/');
  };
  return (
    <div id='sidebar'>
      <div>
        <img
          id='sidebar_logo'
          alt='logo'
          src={require('../global/LogoBlue.png')}
        ></img>
      </div>
      <div className='sidebar-container'>
        <Button
          variant='contained'
          id='sidebar_home_btn'
          className='sidebar_btn'
        >
          <NavLink
            to='/'
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            Style='text-decoration: none'
          >
            HOME
          </NavLink>
        </Button>
      </div>
      <div className='sidebar-container'>
        {!member ? (
          <>
            <div>
              <Button
                variant='contained'
                id='sidebar_creator_btn'
                className='sidebar_btn'
              >
                <NavLink
                  to='/creator'
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                  Style='text-decoration: none'
                >
                  CREATOR
                </NavLink>
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant='contained'
            id='sidebar_login_btn'
            className='sidebar_btn'
          >
            <NavLink
              to='/login'
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              Style='text-decoration: none'
            >
              LOGIN
            </NavLink>
          </Button>
        )}
      </div>
      <div>
        {!member ? (
          <>
            <div>
              <Button
                onClick={gologout}
                variant='contained'
                id='sidebar_logout_btn'
              >
                <NavLink to='/' Style='text-decoration: none'>
                  LOG OUT
                </NavLink>
              </Button>
            </div>
          </>
        ) : null}
      </div>
      <div>
        <QRCodeSVG value={window.location} />
      </div>

      <div className='sidebar-container'></div>
    </div>
  );
};

const Player = () => {
  const { setAudio, setPod } = useContext(AppContext);

  return (
    <div>
      <AudioPlayer
        id='playbar'
        src={localStorage.getItem('episode')}
        autoPlay={false}
        onListen={(e) => {
          setPod(document.querySelector('audio').currentTime);
        }}
        showSkipControls={false}
        showFilledVolume={true}
        Style='background-color:black'
      />
      {(() => {
        setAudio(document.querySelector('audio'));
      })()}
    </div>
  );
};

const Main = { Topbar, Sidebar, Player };
export default Main;
