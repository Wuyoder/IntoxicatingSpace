import { useState, useEffect } from 'react';
import { USER_PROFILE } from '../../global/constants';
import axios from 'axios';

const Profile = () => {
  const [userprofile, setUserprofile] = useState({});
  useEffect(() => {
    const getuserprofile = async () => {
      const res = await axios.get(USER_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUserprofile(res.data);
    };
    getuserprofile();
  }, []);

  const gologout = () => {
    localStorage.clear('token');
    alert('SeeYa');
    window.location.replace('/');
  };

  if (userprofile.error) {
    alert('Please sign in first.');
    window.location.replace('/login');
  } else {
    return (
      <>
        <div id='profile_info'>
          <div className='profile_title'>User Profile</div>
          <div className='profile_image_container'>
            <img
              id='user_image'
              alt='user_image'
              src={localStorage.getItem('user_image')}
            ></img>
          </div>
          <div className='profile_container'>
            <div className='profile_sub1'>
              <div className='profile_row'>name </div>
              <div className='profile_row'>email </div>
            </div>
            <div className='profile_sub2'>
              <div id='user_name' className='profile_text'>
                {userprofile.name}
              </div>
              <div id='user_email' className='profile_text'>
                {userprofile.email}
              </div>
            </div>
          </div>

          <button
            onClick={gologout}
            Style='background-color:black'
            className='login_btn'
          >
            LOG OUT
          </button>
        </div>
        <div></div>
      </>
    );
  }
};
export default Profile;
