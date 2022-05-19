import { useContext } from 'react';
import { AppContext } from '../../../App';
const Msg = ({ item }) => {
  const { audio } = useContext(AppContext);

  const gothattime = () => {
    audio.currentTime = item.chat_episode_time;
    audio.play();
  };

  return (
    <div id='chat_msg_container'>
      <div className='msg'>
        <div className='msg_name'>{item.user_name}</div>
        <div className='msg_msg'>{item.chat_msg}</div>
        <div className='msg_time' onClick={gothattime}>
          {(() => {
            let min = Math.floor(item.chat_episode_time / 60);
            let sec = item.chat_episode_time % 60;
            let modisec = '';
            if (sec.toString().length < 2) {
              modisec = 0 + sec.toString();
            } else {
              modisec = sec;
            }
            return `${min} : ${modisec}`;
          })()}
        </div>
        <div className='msg_day'>
          {(() => {
            let modiday = item.time_click.toString().slice(0, 10);
            return `( ${modiday} )`;
          })()}
        </div>
      </div>
    </div>
  );
};

export default Msg;
