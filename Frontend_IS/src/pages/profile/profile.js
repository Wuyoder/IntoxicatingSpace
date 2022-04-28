import { useState, useEffect } from 'react';
import { USER_PROFILE, HISTORY_LIST, SUBSHOWS } from '../../global/constants';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Searchshow from '../search/components/searchshow';
const Profile = () => {
  const [userprofile, setUserprofile] = useState({});
  const [historylist, setHistorylist] = useState([]);
  const [subshows, setSubshows] = useState([]);
  useEffect(() => {
    const getuserprofile = async () => {
      const res1 = await axios.get(USER_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUserprofile(res1.data);
    };
    const gethistorylist = async () => {
      const res2 = await axios.get(HISTORY_LIST, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setHistorylist(res2.data);
    };
    const getsubshows = async () => {
      const res3 = await axios.get(SUBSHOWS, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSubshows(res3.data);
    };
    gethistorylist();
    getuserprofile();
    getsubshows();
  }, []);

  const gologout = () => {
    localStorage.clear('token');
    alert('SeeYa');
    window.location.replace('/');
  };

  if (userprofile.error) {
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
          <Button
            onClick={gologout}
            Style='background-color:black'
            className='login_btn'
          >
            LOG OUT
          </Button>
        </div>
        <div>
          <div>訂閱節目</div>
          <div className='search_shows'>
            <Row xs={1} md={6} id='boot_row'>
              {subshows.map((item) => {
                return <Searchshow item={item} />;
              })}
            </Row>
          </div>
          <div>瀏覽記錄</div>
          <div className='search_shows'>
            <Row xs={1} md={6} id='boot_row'>
              {historylist.map((item) => {
                return <Searchshow item={item} />;
              })}
            </Row>
          </div>
        </div>
      </>
    );
  }
};
export default Profile;
