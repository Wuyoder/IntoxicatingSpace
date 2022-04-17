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
      <div id='slogan'>Intoxicating Space</div>
      <div>search</div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div id='sidebar'>
      <div>
        <a href='./'>Home</a>
      </div>
      <div>
        <a href='./profile'>Porfile</a>
      </div>
      <div>
        <a href='./creator'>Creator</a>
      </div>
      <div>
        <a href='./dashboard'>Dashboard</a>
      </div>
      <div>user_image</div>
      <div>
        <a href='./login'>login/signup</a>
      </div>
    </div>
  );
};

const Player = () => {
  return (
    <div>
      <audio
        id='player'
        src='https://rss.soundon.fm/rssf/6e5b64e5-3239-4fa0-b8cd-dfc1ce825f1f/feedurl/0b63ed3c-b88b-4b90-879e-093fdaf8287e/rssFileVip.mp3?timestamp=1646784044980'
        controls='controls'
        autoPlay={true}
        preload='auto'
        width='1000'
        height='80'
      ></audio>
      <div id='btnlist'></div>

      <button id='play' Style='background-color:black'>
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
      </button>
    </div>
  );
};

const Main = { Topbar, Sidebar, Player };
export default Main;
