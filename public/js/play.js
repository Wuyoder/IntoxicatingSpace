const showtime = document.getElementById('showtime');
const player = document.getElementById('player');
const mute = document.getElementById('mute');
const forward = document.getElementById('forward');
const backward = document.getElementById('backward');
showtime.addEventListener('click', async () => {
  alert(player.currentTime);
  console.log(player.currentTime);
});
mute.addEventListener('click', () => {
  let sound = player.muted;
  player.muted = !sound;
});
forward.addEventListener('click', () => {
  player.currentTime += 10;
});
backward.addEventListener('click', () => {
  player.currentTime -= 10;
});
player.addEventListener('ended', () => {
  alert('finished.');
});
