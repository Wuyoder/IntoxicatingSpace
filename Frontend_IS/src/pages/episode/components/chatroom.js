import socketio from 'socket.io-client';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../App';
import axios from 'axios';
import { CHAT_HISTORY } from '../../../global/constants';
import Msg from './msg';

const Chatroom = () => {
  const [ws, setWs] = useState(null);
  const [open, setOpen] = useState([]);
  const { audio, episodeid, podcastplayer } = useContext(AppContext);
  const [value, setValue] = useState('');
  //頁面載入時的動作
  useEffect(() => {
    const openhistory = async () => {
      const leavemsg = await axios.post(CHAT_HISTORY, {
        //console.log(window.location.pathname.slice(9).split('-')[0]); TODO: show_id
        //console.log(window.location.pathname.slice(9).split('-')[1]); TODO: episode_id
        show_id: window.location.pathname.slice(9).split('-')[0],
        episode_id: episodeid,
      });
      setOpen(leavemsg.data);
      setValue(leavemsg.data.length);
    };
    const connectWebSocket = () => {
      setWs(socketio(process.env.REACT_APP_BE));
    };
    openhistory();
    connectWebSocket();
  }, [value, episodeid]);

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
      if (!open[0]) {
        scrolltarget.scrollTop = 0;
        console.log('initial', podcastplayer);
      } else {
        let i = 0;
        while (open[i]?.chat_episode_time <= podcastplayer) {
          i += 1;
        }
        scrolltarget.scrollTop = (i - 4) * 25;
      }
    };
    autoscroll();
  }, [podcastplayer, open]);

  const initWebSocket = () => {
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    ws.on('getMessage', (message) => {
      setOpen(message);
      setValue(message.length);
    });
  };

  const sendMessage = () => {
    //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
    if (document.getElementById('msg').value !== '') {
      const msg = document.getElementById('msg');
      const token = localStorage.getItem('token');
      let message = {
        token: token,
        msg: msg.value,
        show_id: window.location.pathname.slice(9).split('-')[0],
        episode_id: episodeid,
        type: 'text',
        currentTime: audio.currentTime,
      };
      ws.emit('getMessage', message);
      msg.value = '';
    } else {
      alert('please share you message with ');
    }
  };

  return (
    <div id='chatbox'>
      <div>
        <div id='chatroom'>
          {open.map((item) => {
            return <Msg item={item} />;
          })}
        </div>
        <input id='msg' Style='background-color:black'></input>
        <input
          id='send_msg'
          className='input_type'
          type='button'
          value='Send '
          onClick={sendMessage}
          Style='background-color:black'
        />
      </div>
    </div>
  );
};
export default Chatroom;
