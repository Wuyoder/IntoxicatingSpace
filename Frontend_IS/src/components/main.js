import { useNavigate, Link, NavLink } from 'react-router-dom';
import { COUNTER_LOGINS, SEARCH } from '../global/constants';
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AppContext } from '../App';
let activeStyle = {
  backgroundcolor: 'blue',
  color: 'yellow',
  fontWeight: 'bold',
};
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
    return <>with you {counterlogins} times</>;
  }
  if (!counterlogins) {
    return <></>;
  }
};

const Topbar = () => {
  const { search, setSearch } = useContext(AppContext);
  console.log(search);

  const gosearch = async () => {
    if (document.getElementById('search_input').value != null) {
      const res = await axios.post(SEARCH, {
        keyword: document.getElementById('search_input').value,
      });
      document.getElementById('search_input').value = '';
      if (res.data.error !== 'no keyword') {
        setSearch(res.data);
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
      <div id='slogan'>
        Intoxicating Space <Withyou />
      </div>
      <div>
        <input id='search_input' Style='background-color:black'></input>
        <NavLink to='/search'>
          <button
            id='search_btn'
            Style='background-color:black'
            onClick={gosearch}
          >
            Search
          </button>
        </NavLink>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { search, setSearch } = useContext(AppContext);
  return (
    <div id='sidebar'>
      <div>
        <NavLink
          to='/'
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          Home
        </NavLink>
      </div>
      <div>
        <NavLink
          to='/creator'
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          Creator
        </NavLink>
      </div>
      <div>
        <NavLink
          to='/dashboard'
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          Dashboard
        </NavLink>
      </div>
      <div>
        <NavLink
          to='/login'
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          Login/Signup
        </NavLink>
      </div>
    </div>
  );
};

const Player = () => {
  const { podcastplayer, setPod } = useContext(AppContext);

  return (
    <div>
      <AudioPlayer
        id='playbar'
        src={localStorage.getItem('episode')}
        onPlay={(e) =>
          console.log('Play', document.querySelector('audio').currentTime)
        }
        onListen={(e) => {
          console.log('Play', document.querySelector('audio').currentTime);
          setPod(document.querySelector('audio').currentTime);
        }}
        autoPlay={false}
        showSkipControls={false}
        showFilledVolume={true}
        Style='background-color:black'
      />
    </div>
  );
};

const Main = { Topbar, Sidebar, Player };
export default Main;
