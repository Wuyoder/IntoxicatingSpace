window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('main').innerHTML = `<div class="show" id="show_hot">
          <div class="show_list_top">
            <div class="show_list_title">熱門推薦</div>
            <a  class="show_more">more</a>
          </div>
          <div id="show_list_main1">
          </div>
        </div>
        <div class="show" id="show_history">
          <div class="show_list_top">
            <div class="show_list_title">熱門推薦</div>
            <a  class="show_more">more</a>
          </div>
          <div id="show_list_main2">   
          </div>
        </div>
        <div class="show" id="show_recommend">
          <div class="show_list_top">
            <div class="show_list_title">熱門推薦</div>
            <a  class="show_more">more</a>
          </div>
          <div id="show_list_main3">
          </div>
        </div>`;

  axios.get('/api/1.0/user/showlist').then((response) => {
    const data = response.data;
    let show1 = '';
    let show2 = '';
    let show3 = '';
    for (i = 0; i < 6; i++) {
      show1 += `<a href="./show.html?${data[i].rss_id}" class="show">
      <img class="show_image show" src="${data[i].rss_image}">
            <div class="show_name show">${data[i].rss_title}</div>
            <div style="display:none">${data[i].rss_url}</div>
            <div class="show_category show">${data[i].rss_category_main}</div></a>`;
      show2 += `<a href="./show.html?${
        data[i + 6].rss_id
      }"><img class="show_image" src="${data[i + 6].rss_image}" class="show">
            <div class="show_name">${data[i + 6].rss_title}</div>
            <div class="show_category">${
              data[i + 6].rss_category_main
            }</div></a>`;
      show3 += `<a href="./show.html?${
        data[i + 12].rss_id
      }"><img class="show_image" src="${data[i + 12].rss_image}" class="show">
            <div class="show_name">${data[i + 12].rss_title}</div>
            <div class="show_category">${
              data[i + 12].rss_category_main
            }</div></a>`;
    }
    document.getElementById('show_list_main1').innerHTML = show1;
    document.getElementById('show_list_main2').innerHTML = show2;
    document.getElementById('show_list_main3').innerHTML = show3;
    document.getElementsByClassName('show').addEventListener('click', () => {
      localStorage.setItem('choice', data[i].rss_url);
    });
  });
});
