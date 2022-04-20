import { useNavigate, Link, NavLink } from 'react-router-dom';
import { COUNTER_LOGINS } from '../global/constants';
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AppContext } from '../App';
let activeStyle = {
  textDecoration: 'wavy underline overline  white',
  color: 'white',
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
      <div>search</div>
    </div>
  );
};

const Sidebar = () => {
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
          to='/profile'
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
        >
          Profile
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
  const { episodeurl } = useContext(AppContext);

  ///

  return (
    <div>
      {/* <button
        onClick={() => {
          console.log(document.querySelector('audio').currentTime);
        }}
      >
        now
      </button> */}
      <AudioPlayer
        id='playbar'
        src={localStorage.getItem('episode')}
        onPlay={(e) => console.log('Play')}
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

{
  /* <audio
        id='player'
        src={localStorage.getItem('episode')}
        controls='controls'
        autoPlay={false}
        preload='auto'
        width='1000'
        height='80'
      ></audio>
      <div id='btnlist'></div>

      <button
        id='play'
        Style='background-color:black'
        onClick={() => {
          document.getElementById('player');
        }}
      >
        Play
      </button>
      <button id='pause' Style='background-color:black'>
        Pause
      </button>
      <button id='volup' Style='background-color:black'>
        Vol +
      </button>
      <button id='voldown' Style='background-color:black'>
        Vol -
      </button>
      <button id='speed2' Style='background-color:black'>
        speed 2
      </button>
      <button id='speed1' Style='background-color:black'>
        speed 1
      </button>
      <button id='showtime' Style='background-color:black'>
        currentTime
      </button>
      <button id='mute' Style='background-color:black'>
        mute
      </button>
      <button id='forward' Style='background-color:black'>
        forward10
      </button>
      <button id='backward' Style='background-color:black'>
        backward10
      </button> */
}
