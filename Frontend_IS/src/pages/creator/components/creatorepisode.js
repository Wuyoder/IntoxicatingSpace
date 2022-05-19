import { Link } from 'react-router-dom';
const Creatorepisode = ({ creatorepisode }) => {
  return (
    <>
      <div className='episode'>
        <div>
          <Link to='/'>
            <div className='episode_date'>
              episode_date: {creatorepisode?.episode_publish_date}
            </div>
            <div className='episode_title'>
              episode_title: {creatorepisode?.episode_title}
            </div>
            <div className='episode_episode'>
              episode_episode: {creatorepisode?.episode_episode}
            </div>
            <div className='episode_des'>
              episode_des: {creatorepisode?.episode_des}
            </div>
          </Link>
        </div>
        <div>
          <div className='episode_duration'>
            episode_duration:
            {creatorepisode?.episode_duration}
          </div>
        </div>
        <div>
          <div className='episode_status'>
            episode_status: {creatorepisode?.episode_status}
          </div>
        </div>
        <div>
          <div className='episode_click'>
            episode_click: {creatorepisode?.episode_click}
          </div>
        </div>
      </div>
      <div>--------------------------------------</div>
    </>
  );
};
export default Creatorepisode;
