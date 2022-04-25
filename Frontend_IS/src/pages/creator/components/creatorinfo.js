import { useEffect, useState } from 'react';
import axios from 'axios';
import { CREATOR_PROFILE } from '../../../global/constants';

const Creatorinfo = () => {
  const [cprofile, setCprofile] = useState([]);
  useEffect(() => {
    const getcreatorinfo = async () => {
      const res = await axios.get(CREATOR_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCprofile(res.data[0]);
    };
    getcreatorinfo();
  }, []);

  return (
    <div className='cp_container'>
      <h2 className='profile_title'>Creator Info</h2>
      <div id='creator_name' className='creator_type'>
        creator name : {cprofile.creator_name}
      </div>
      <div id='creator_email' className='creator_type'>
        creator email : {cprofile.creator_email}
      </div>
      <div id='show_name' className='creator_type'>
        show name : {cprofile.show_name}
      </div>
      <div className='creator_type'>
        <img
          id='show_image'
          alt='show_image'
          src={localStorage.getItem('creator_image')}
        ></img>
      </div>
      <div className='creator_type'>show description : {cprofile.show_des}</div>
      <div className='creator_type'>
        show category : {cprofile.show_category_main} -{' '}
        {cprofile.show_category_sub}
      </div>
      <div id='show_rss' className='creator_type'>
        rss feed url :
        <input
          id='rssfeed'
          value={
            'https://intoxicating.spaceapi/1.0/user/rss/' + cprofile.show_id
          }
          unselectable='on'
        ></input>
      </div>
      <div id='show_last_update' className='creator_type'>
        show last update : {cprofile.show_time_update}
      </div>
      <div id='show_subscriber' className='creator_type'>
        subscriber : {cprofile.show_subscriber}
      </div>
    </div>
  );
};
export default Creatorinfo;
