const Chatroom = () => {
  return (
    <div id='chat_space'>
      <div>
        <textarea id='chatroom'></textarea>
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
