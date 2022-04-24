import socketio from 'socket.io-client';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../App';
import axios from 'axios';
import { CHAT_HISTORY } from '../../../global/constants';

const Chatroom = () => {
  const [ws, setWs] = useState(null);
  const [open, setOpen] = useState([]);
  const { getcurrent, podcastplayer } = useContext(AppContext);

  //頁面載入時的動作
  useEffect(() => {
    const openhistory = async () => {
      const leavemsg = await axios.post(CHAT_HISTORY, {
        show_id: 'show_id',
        episode_id: 'episode_id',
      });
      setOpen(leavemsg.data);
      console.log(leavemsg.data);
    };
    const connectWebSocket = () => {
      setWs(socketio(process.env.REACT_APP_BE));
    };
    openhistory();
    connectWebSocket();
  }, []);

  useEffect(() => {
    if (ws) {
      console.log('success connect!');
      initWebSocket();
    }
  }, [ws]);

  useEffect(() => {
    const autoscroll = () => {
      const scrolltarget = document.getElementById('chatroom');
      // compare podcastplayer to div hash? value?
      console.log('---------------allmsg-----------------');
      if (!open[0]) {
        scrolltarget.scrollTop = 0;
        console.log('initial', podcastplayer);
      } else {
        let i = 0;
        while (open[i]?.chat_episode_time <= podcastplayer) {
          i += 1;
        }
        scrolltarget.scrollTop = i * 20;
      }
    };
    autoscroll();
  }, [podcastplayer, open]);

  const initWebSocket = () => {
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    ws.on('getMessage', (message) => {
      const chatroom = document.getElementById('chatroom');
      let history = '';
      console.log(message);
      message.map((item) => {
        return (history += `<div id=${item.chat_id} className='ref' Style='display:none'>${item.chat_episode_time}</div><div className='msg' data-hash=${item.chat_episode_time}>${item.user_id}-${item.chat_msg}-${item.chat_episode_time}</div>`);
      });
      chatroom.innerHTML = history;

      const scrolltarget = document.getElementById('chatroom');
      console.log('scrolltarget.scrollTop', scrolltarget.scrollTop);
    });
  };

  const sendMessage = () => {
    //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
    const msg = document.getElementById('msg');
    const token = localStorage.getItem('token');
    let message = {
      token: token,
      msg: msg.value,
      show_id: 'show_id',
      episode_id: 'episode_id',
      type: 'text',
      currentTime: podcastplayer,
    };
    ws.emit('getMessage', message);
    msg.value = '';
  };

  return (
    <div id='chatbox'>
      <div>
        <div id='chatroom'>
          {open.map((item) => {
            return (
              <>
                <div id={item.chat_id} className='ref' Style='display:none'>
                  ${item.chat_episode_time}
                </div>
                <div className='msg' data-hash={item.chat_episode_time}>
                  {item.user_id}-{item.chat_msg}-{item.chat_episode_time}
                </div>
              </>
            );
          })}
        </div>
        <input id='msg' Style='background-color:black'></input>
        <input
          type='button'
          value='送出訊息'
          onClick={sendMessage}
          Style='background-color:black'
        />
      </div>
    </div>
  );

  return (
    <div>
      <div>
        <textarea></textarea>
      </div>
      <div>
        <input id='input'></input>
      </div>
      <div>
        <input type='button' value='submit'></input>
      </div>
    </div>
  );
};
export default Chatroom;
