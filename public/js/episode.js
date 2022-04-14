window.addEventListener('DOMContentLoaded', () => {
  query = window.location.search.substring(1);
  axios.get(`/api/1.0/user/episodechoice/${query}`).then((response) => {
    const data = response.data;
    document.getElementById('show_ifo').innerHTML = `
            <img class="show_image" src="${data.item.itunes.image}">
            <div class="show_detail">${data.title}</div>
            <div class="show_detail">${data.item.itunes.explicit}</div>
            <div class="show_detail">${data.author}</div>
            <div class="show_detail">${data.item.content}</div>
            <div class="show_sub">subscribe</div>
    `;
    document.getElementById('chat_head').innerHTML = `
            <div>
                 <div class="episode_title">${data.item.title}</div>
                 <div class="episode_date">${data.item.pubDate}</div>
            </div>
            <div>
                <div class="episode_duration">${data.item.itunes.duration}</div>
            </div>
    `;
    document.getElementById('chat_space').innerHTML = `
                <div><textarea id="chatroom"></textarea></div>
                <div><input id="input"></div>
                <div><input type="button" value="submit"></div>
    `;
    localStorage.setItem('episode', data.item.enclosure.url);
  });
});
