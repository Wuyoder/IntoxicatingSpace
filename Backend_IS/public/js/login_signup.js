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

////
const L_btn = document.getElementById('L_btn');
L_btn.addEventListener('click', () => {
  alert('Login!');
});
const S_btn = document.getElementById('S_btn');
S_btn.addEventListener('click', () => {
  const S_name = document.getElementById('S_name').value;
  const S_email = document.getElementById('S_email').value;
  const S_pwd = document.getElementById('S_pwd').value;
  const S_birth = document.getElementById('S_birth').value;
  alert(`${S_name}, ${S_email}, ${S_pwd}, ${S_birth}`);
  console.log(S_name, S_email, S_pwd, S_birth);
});
