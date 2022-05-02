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
      <div>
        <img
          id='show_image'
          alt='show_image'
          src={localStorage.getItem('creator_image')}
        ></img>
      </div>
      <div id='cp_r'>
        <div id='cp_r_l'>
          <div className='origin_cp_info'>Creator Name </div>
          <div className='origin_cp_info'>Creator E-mail </div>
          <div className='origin_cp_info'>Podcast Name </div>
          <div className='origin_cp_info'>Podcast Description </div>
          <div className='origin_cp_info'>Podcast Category</div>
          <div className='origin_cp_info'>RSS Feed's URL</div>
          <div className='origin_cp_info'>Last Update</div>
          <div className='origin_cp_info'>Subscriber</div>
        </div>
        <div id='cp_r_r'>
          <div>{cprofile.creator_name}</div>
          <div>{cprofile.creator_email}</div>
          <div>{cprofile.show_name}</div>
          <div>{cprofile.show_des}</div>
          <div>
            {cprofile.show_category_main}-{cprofile.show_category_sub}
          </div>
          <div>
            <input
              id='rssfeed'
              value={
                'https://intoxicating.spaceapi/1.0/user/rss/' + cprofile.show_id
              }
              unselectable='on'
            ></input>
          </div>
          <div>{cprofile.show_time_update}</div>
          <div>{cprofile.show_subscriber}</div>
        </div>
      </div>
    </div>
  );
};
export default Creatorinfo;
