import Info from './components/info';
import Chatroom from './components/chatroom';

const Episode = () => {
  return (
    <div id='chat_parts'>
      <div>
        <div>
          <Info />
        </div>
      </div>
      <Chatroom />
    </div>
  );
};
export default Episode;
