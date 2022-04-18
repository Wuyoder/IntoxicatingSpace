import { Link } from 'react-router-dom';
const Creatorepisode = () => {
  return (
    <>
      <div id='show_episode'>
        <div class='episode'>
          <div>
            <Link to='/'>
              <div class='episode_date'>20220412</div>
              <div class='episode_title'>這是一集關於散步的故事</div>
              <div class='episode_play'></div>
            </Link>
          </div>
          <div>
            <div class='episode_duration'>100second</div>
          </div>
          <div>
            <div class='episode_play'>on/off</div>
          </div>
          <div>
            <div class='episode_status'>on/off</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Creatorepisode;
