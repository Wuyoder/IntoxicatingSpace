window.addEventListener('DOMContentLoaded', () => {
  query = window.location.search.substring(1);
  axios.get(`/api/1.0/user/showchoice/${query}`).then((response) => {
    const data = response.data;
    document.getElementById('show_details').innerHTML = `
    <div class="show_name">${data.title}</div>
            <div class="show_detail">${data.itunes.author}</div>
            <a><img class="show_image" src="${data.itunes.image}"></a>
            <div class="show_detail">${data.itunes.categories[0]}</div></a>
            <div class="show_detail">${data.description}</div>
            <div class="show_sub" id="sub_btn">subscribe</div></div>
          <div id="show_episode"></div> `;
    const items_length = data.items.length;
    let items = '';
    for (let i = 0; i < items_length; i++) {
      items += `<div class="episode">
                <div><a href="./episode.html?${query}-${i}">
                    <div class="episode_date">${data.items[i].pubDate}</div>
                    <div class="episode_title">${data.items[i].title}</div>
                    <div class="episode_play"></div>
                </a></div>
                <div>
                    <div class="episode_duration">${data.items[i].itunes.duration}</div>
                </div>
              </div>`;
    }
    document.getElementById('show_episode').innerHTML = items;
  });
});
