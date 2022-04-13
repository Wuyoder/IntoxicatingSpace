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

window.addEventListener('DOMContentLoaded', () => {
  axios
    .get('https://intoxicating.space/api/1.0/user/showlist')
    .then((response) => {
      const data = response.data;
      let show1 = '';
      let show2 = '';
      let show3 = '';
      for (i = 0; i < 6; i++) {
        show1 += `<a href="./show.html"><img class="show_image" src="${data[i].rss_image}">
            <div class="show_name">${data[i].rss_title}</div>
            <div class="show_category">${data[i].rss_category_main}</div></a>`;
        show2 += `<a href="./show.html"><img class="show_image" src="${
          data[i + 6].rss_image
        }">
            <div class="show_name">${data[i + 6].rss_title}</div>
            <div class="show_category">${
              data[i + 6].rss_category_main
            }</div></a>`;
        show3 += `<a href="./show.html"><img class="show_image" src="${
          data[i + 12].rss_image
        }">
            <div class="show_name">${data[i + 12].rss_title}</div>
            <div class="show_category">${
              data[i + 12].rss_category_main
            }</div></a>`;
      }
      document.getElementById('show_list_main1').innerHTML = show1;
      document.getElementById('show_list_main2').innerHTML = show2;
      document.getElementById('show_list_main3').innerHTML = show3;
    });
});
