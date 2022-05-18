import { NavLink, Link } from 'react-router-dom';
import { COUNTER_LOGINS, SEARCH } from '../global/constants';
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AppContext } from '../App';
import { Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ajax from '../util/ajax';

const Withyou = () => {
  const [counterlogins, setCounterlogins] = useState(0);
  useEffect(() => {
    const getCounter = async () => {
      const res = await ajax('get', COUNTER_LOGINS);
      setCounterlogins(res.data.status);
    };
    getCounter();
  }, []);

  if (counterlogins > 0) {
    return <>with you {counterlogins} times.</>;
  }
  if (!counterlogins) {
    return <></>;
  }
};

const Topbar = () => {
  const { setSearch } = useContext(AppContext);
  const gosearch = async () => {
    if (document.getElementById('search_input').value !== '') {
      const res = await ajax('post', SEARCH, {
        keyword: document.getElementById('search_input').value,
      });
      document.getElementById('search_input').value = '';
      if (res.data.error !== 'no keyword') {
        setSearch(res.data);
        document.getElementById('gotosearch').click();
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

  return (
    <div id='topbar'>
      <div className='withyou'>
        <p className='withyou'>
          Intoxicating Space <Withyou />
        </p>
      </div>
      <div></div>

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
          <Link to='/search' Style='text-decoration:none'>
            <button id='gotosearch' Style='display:none'>
              go
            </button>
          </Link>
          <Button
            variant='contained'
            id='search_btn'
            onClick={gosearch}
            className='search_btn'
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

let activeStyle = {
  color: 'darkcyan',
};

const Sidebar = ({ member }) => {
  const MySwal = withReactContent(Swal);
  const gologout = () => {
    localStorage.clear();
    MySwal.fire({
      title: (
        <>
          <h4 className='alert'>SeeYa</h4>
        </>
      ),
      didOpen: () => {
        MySwal.showLoading();
      },
    });
    window.location.replace('/');
  };
  const goindex = () => {
    document.getElementById('HOME_BTN').click();
  };
  return (
    <div id='sidebar'>
      <div>
        <img
          id='sidebar_logo'
          alt='logo'
          src={require('../global/LogoBlue.png')}
          onClick={goindex}
        ></img>
      </div>
      <div className='sidebar-container'>
        <NavLink
          to='/'
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          Style='text-decoration: none'
          id='HOME_BTN'
        >
          <Button
            variant='contained'
            id='sidebar_home_btn'
            className='sidebar_btn'
          >
            HOME
          </Button>
        </NavLink>
      </div>
      <div className='sidebar-container'>
        {!member ? (
          <>
            <div>
              <NavLink
                to='/creator'
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                Style='text-decoration: none'
              >
                <Button
                  variant='contained'
                  id='sidebar_creator_btn'
                  className='sidebar_btn'
                >
                  CREATOR
                </Button>
              </NavLink>
            </div>
          </>
        ) : (
          <NavLink
            to='/login'
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            Style='text-decoration: none'
          >
            <Button
              variant='contained'
              id='sidebar_login_btn'
              className='sidebar_btn'
            >
              LOGIN
            </Button>
          </NavLink>
        )}
      </div>
      <div>
        {!member ? (
          <>
            <div>
              <NavLink to='/' Style='text-decoration: none'>
                <Button
                  onClick={gologout}
                  variant='contained'
                  id='sidebar_logout_btn'
                >
                  LOG OUT
                </Button>
              </NavLink>
            </div>
          </>
        ) : null}
      </div>

      <div className='sidebar-container'></div>
    </div>
  );
};

const Player = () => {
  const { setAudio, setPod } = useContext(AppContext);

  return (
    <>
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
      <div Style='position:fixed; bottom:10vh; left:87vw; color:#6f96a6; font-size:o.5em'>
        &copy; Intoxicating Space
      </div>
      <Link
        to={`/episode/${localStorage.getItem('nowplay_url')}`}
        id='now_link'
      >
        <div id='nowplay_btn'>
          {(() => {
            if (localStorage.getItem('nowplay_title') !== null) {
              return localStorage.getItem('nowplay_title');
            } else {
              return <div id='no_nowplay'>Choose you love and play ~</div>;
            }
          })()}
        </div>
      </Link>
    </>
  );
};

const Main = { Topbar, Sidebar, Player };
export default Main;
