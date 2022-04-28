import { useNavigate, Link, NavLink } from 'react-router-dom';
import { COUNTER_LOGINS, SEARCH } from '../global/constants';
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AppContext } from '../App';

const Withyou = () => {
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
    return <>With You {counterlogins} Times</>;
  }
  if (!counterlogins) {
    return <></>;
  }
};

const Topbar = () => {
  const { search, setSearch } = useContext(AppContext);
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

  return (
    <div id='topbar'>
      <div>
        <img
          id='main_logo'
          alt='main_logo'
          src='https://intoxicating.s3.ap-northeast-1.amazonaws.com/IS_LOGO.png'
        ></img>
      </div>
      <div className='withyou'>
        <p className='withyou'>
          Intoxicating Space <Withyou />
        </p>
      </div>
      <div className='search_container'>
        <div className='search_item'>
          <input id='search_input' Style='background-color:black'></input>
        </div>
        <div className='search_item'>
          <NavLink to='/search'>
            <button
              id='search_btn'
              Style='background-color:black'
              onClick={gosearch}
              className='search_btn'
            >
              Search
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

let activeStyle = {
  color: 'aqua',
  fontWeight: 'bold',
};

const Sidebar = ({ member }) => {
  return (
    <div id='sidebar'>
      <div className='sidebar-container'>
        <NavLink
          to='/'
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          Style='text-decoration: none'
          className='sidebar_btn'
        >
          HOME
        </NavLink>
      </div>
      <div className='sidebar-container'>
        {!member ? (
          <NavLink
            to='/creator'
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            Style='text-decoration: none'
            className='sidebar_btn'
          >
            CREATOR
          </NavLink>
        ) : null}
      </div>
      {/* <div className='sidebar-container'>
        <NavLink
          to='/dashboard'
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          Style='text-decoration: none'
          className='sidebar_btn'
        >
          DASHBOARD
        </NavLink>
      </div> */}
      <div className='sidebar-container'>
        {member ? (
          <NavLink
            to='/login'
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            Style='text-decoration: none'
            className='sidebar_btn'
          >
            LOGIN
          </NavLink>
        ) : null}
      </div>
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
          setPod(e.srcElement.currentTime);
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
