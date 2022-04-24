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
          <img
            id='user_image'
            alt='user_image'
            src={localStorage.getItem('user_image')}
          ></img>
          <div id='user_name'>{userprofile.name}</div>
          <div id='user_email'>{userprofile.email}</div>
          <button onClick={gologout} Style='background-color:black'>
            LOG OUT
          </button>
        </div>
        <div></div>
      </>
    );
  }
};
export default Profile;
