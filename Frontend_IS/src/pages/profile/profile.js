import { useState, useEffect } from 'react';
import { USER_PROFILE, HISTORY_LIST, SUBSHOWS } from '../../global/constants';
import { Card } from '@mui/material';
import Row from 'react-bootstrap/Row';
import Searchshow from '../search/components/searchshow';
import Step from '../step/steps';
import ajax from '../../util/ajax';
const Profile = () => {
  const [userprofile, setUserprofile] = useState({});
  const [historylist, setHistorylist] = useState([]);
  const [subshows, setSubshows] = useState([]);
  useEffect(() => {
    const getuserprofile = async () => {
      const res1 = await ajax('get', USER_PROFILE);
      setUserprofile(res1.data);
    };
    const gethistorylist = async () => {
      const res2 = await ajax('get', HISTORY_LIST);

      setHistorylist(res2.data);
    };
    const getsubshows = async () => {
      const res3 = await ajax('get', SUBSHOWS);
      setSubshows(res3.data);
    };
    gethistorylist();
    getuserprofile();
    getsubshows();
  }, []);

  if (userprofile.error) {
    window.location.replace('/login');
  } else {
    return (
      <>
        <Step.StepUserprofile />
        <div id='profile_info'>
          <div
            id='userprofile_image'
            style={{
              background: `url(${localStorage.getItem(
                'user_image'
              )}) 50% 0 no-repeat `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div></div>
          </div>
          <div className='profile_container'>
            <div className='profile_sub1'>
              <div className='profile_row'>Username </div>
              <div className='profile_row'>E-mail </div>
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
        </div>
        <div>
          <div className='profile_subtitle'>訂閱節目</div>
          <Card variant='outlined' id='subshows_container'>
            <div className='search_shows'>
              <Row xs={1} md={6} id='boot_row'>
                {subshows.map((item) => {
                  return <Searchshow item={item} />;
                })}
              </Row>
            </div>
          </Card>
          <div className='profile_subtitle'>瀏覽記錄</div>
          <Card variant='outlined' id='historyshows_container'>
            <div className='search_shows'>
              <Row xs={1} md={6} id='boot_row'>
                {historylist.map((item) => {
                  return <Searchshow item={item} />;
                })}
              </Row>
            </div>
          </Card>
        </div>
      </>
    );
  }
};
export default Profile;
