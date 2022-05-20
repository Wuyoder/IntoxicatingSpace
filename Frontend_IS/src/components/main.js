import { NavLink, Link } from 'react-router-dom';
import { COUNTER_LOGINS, SEARCH } from '../global/constants';
import React, { useEffect, useContext, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AppContext } from '../App';
import { Button, TextField } from '@mui/material';
import salert from '../util/salert';
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
    <div
      Style='display: flex;flex-direction: row;padding: 0 5vh 0 10vh;background-color: #6f96a6;width: 100%;
  height: 6vh;flex-direction: row;justify-content: space-between;align-items: center;padding: 0'
    >
      <div>
        <p Style='font-weight: 400;font-size: 1.1em;margin: 0 0 0 2vw'>
          Intoxicating Space <Withyou />
        </p>
      </div>
      <div></div>

      <div Style=' display: flex;margin-right: 3vw'>
        <div Style='margin: 0.5vw'>
          <TextField
            label='Keyword'
            variant='outlined'
            id='search_input'
            Style='background-color: #6f96a6 ;'
            onKeyDown={enter}
          ></TextField>
        </div>
        <div Style='margin: 0.5vw'>
          <Link to='/search' Style='text-decoration:none'>
            <button id='gotosearch' Style='display:none'>
              go
            </button>
          </Link>
          <Button
            variant='contained'
            id='search_btn'
            onClick={gosearch}
            Style='background-color: #6f96a6;color: aliceblue;height: 4vh; width: 7vw;'
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
  const gologout = () => {
    localStorage.clear();
    salert('seeya');
    window.location.replace('/');
  };
  const goindex = () => {
    document.getElementById('HOME_BTN').click();
  };
  return (
    <div
      Style='background: linear-gradient(#274050, #222a32); width: 9vw;
  height: auto; display: flex; justify-content: flex-start; align-items: center;
  flex-direction: column;'
    >
      <div>
        <img
          alt='logo'
          src={require('../global/LogoBlue.png')}
          onClick={goindex}
          id='sidebar_logo'
          Style='max-width: 4vw;  margin-top: 2vh;  margin-bottom: 2vh;'
        ></img>
      </div>
      <div Style='margin: 20px'>
        <NavLink
          to='/'
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          Style='text-decoration: none'
          id='HOME_BTN'
        >
          <Button
            variant='contained'
            Style='background-color: #274050 !important; width: 7vw; color: aliceblue;'
          >
            HOME
          </Button>
        </NavLink>
      </div>
      <div Style='margin: 20px'>
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
                  Style='background-color: #274050 !important; width: 7vw; color: aliceblue;'
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
              Style='background-color: #274050 !important; width: 7vw; color: aliceblue;'
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
                  Style='background-color: #274050 !important; width: 7vw; color: aliceblue;'
                >
                  LOG OUT
                </Button>
              </NavLink>
            </div>
          </>
        ) : null}
      </div>

      <div Style='margin: 20px'></div>
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
          Style='width: 100%;height: 10vh;background-color: #0b1a26; color: black;'
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
        Style='text-decoration: none'
      >
        <div
          id='nowplay_btn'
          Style='font-size: 0.5em;  z-index: 2;  max-width: 25vw;  min-width: 25vw;  overflow: hidden;  text-overflow: ellipsis;
  display: -webkit-box;  -webkit-line-clamp: 1;  -webkit-box-orient: vertical;  position: fixed;  bottom: 1.5vh;  left: 10vw;  display: none;'
        >
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
