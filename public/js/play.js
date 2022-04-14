window.addEventListener('DOMContentLoaded', () => {
  const url = localStorage.getItem('episode');
  document.getElementById('playbar').innerHTML = `
  <audio
        id="player"
        src="${url}"
        controls="controls"
        autoplay="true"
        preload="auto"
        width="1000"
        height="80"
      ></audio>
      <div id="btnlist"></div>
  `;

  const btnlist = document.getElementById('btnlist');
  btnlist.innerHTML = `<button id="play" style="background-color:black" >Play</button>
        <button id="pause" style="background-color:black">Pause</button>
        <button id="volup" style="background-color:black">Vol +</button>
        <button id="voldown" style="background-color:black">Vol -</button>
        <button id="speed2" style="background-color:black">speed 2</button>
        <button id="speed1" style="background-color:black">speed 1</button>
        <button id="showtime" style="background-color:black">currentTime</button>
        <button id="mute" style="background-color:black">mute</button>
        <button id="forward" style="background-color:black">forward10</button>
        <button id="backward" style="background-color:black">backward10</button>`;
  const player = document.getElementById('player');
  document.getElementById('showtime').addEventListener('click', async () => {
    alert(player.currentTime);
    console.log(player.currentTime);
  });
  document.getElementById('mute').addEventListener('click', () => {
    let sound = player.muted;
    player.muted = !sound;
  });
  document.getElementById('forward').addEventListener('click', () => {
    player.currentTime += 10;
  });
  document.getElementById('backward').addEventListener('click', () => {
    player.currentTime -= 10;
  });
  document.getElementById('play').addEventListener('click', () => {
    player.play();
  });
  document.getElementById('pause').addEventListener('click', () => {
    player.pause();
  });
  document.getElementById('volup').addEventListener('click', () => {
    player.volume += 0.1;
  });
  document.getElementById('voldown').addEventListener('click', () => {
    player.volume -= 0.1;
  });
  document.getElementById('speed1').addEventListener('click', () => {
    player.playbackRate = 1;
  });
  document.getElementById('speed2').addEventListener('click', () => {
    player.playbackRate = 2;
  });

  player.addEventListener('ended', () => {
    alert('you just finished one episode, I.S with you <3.');
  });
});
function setCookie(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value =
    escape(value) + (exdays == null ? '' : '; expires=' + exdate.toUTCString());
  document.cookie = c_name + '=' + c_value;
}

function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(';');
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
    x = x.replace(/^\s+|\s+$/g, '');
    if (x == c_name) {
      return unescape(y);
    }
  }
}

var song = document.getElementsByTagName('audio')[0];
var played = false;
var tillPlayed = getCookie('timePlayed');
function update() {
  if (!played) {
    if (tillPlayed) {
      song.currentTime = tillPlayed;
      song.play();
      played = true;
    } else {
      song.play();
      played = true;
    }
  } else {
    setCookie('timePlayed', song.currentTime);
  }
}
setInterval(update, 1000);
