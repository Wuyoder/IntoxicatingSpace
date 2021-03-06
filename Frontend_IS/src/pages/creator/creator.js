import Creatorinfo from './components/creatorinfo';
import { useEffect, useState } from 'react';
import { CREATOR_PROFILE, ISHOST_SHOW } from '../../global/constants';
import Profile from '../profile/profile';
import Updateuser from '../profile/components/updateuser';
import Updatecreator from './components/updatecreator';
import Episode from '../creator/components/episode';
import Newepisode from '../creator/components/newepisode';
import { Button, Card } from '@mui/material';
import ajax from '../../util/ajax';
const Creator = () => {
  const [creatorprofile, setCreatorprofile] = useState([]);
  const [creatorepisode, setCreatorepisode] = useState([]);
  const [updateuser, setUpdateuser] = useState(true);
  const [updatcreator, setUpdatecreator] = useState(false);
  const [newepisode, setNewepisode] = useState(true);
  const [biguser, setBiguser] = useState(true);
  const [bigcreator, setBigcreator] = useState(false);
  const [bigepi, setBigepi] = useState(false);

  useEffect(() => {
    const getcreatorinfo = async () => {
      const res1 = await ajax('get', CREATOR_PROFILE);
      if (!res1.data[0].user_id) {
        window.location.replace('/');
      }
      const res2 = await ajax('get', ISHOST_SHOW);
      setCreatorprofile(res1.data[0]);
      setCreatorepisode(res2.data);
    };
    getcreatorinfo();
  }, []);

  return (
    <Card variant='outlined' id='creator_container'>
      <div className='creator_container'>
        <div className='creator_btn_container'>
          <div>
            <div>
              <Button
                onClick={() => {
                  setUpdateuser(!updateuser);
                  setBiguser(true);
                  setBigcreator(false);
                  setBigepi(false);
                  setUpdatecreator(false);
                  setNewepisode(false);
                }}
                id='creator_userprofile_btn'
              >
                User Profile
              </Button>
            </div>
          </div>
          <div>
            <Button
              onClick={() => {
                setUpdatecreator(!updatcreator);
                setBiguser(false);
                setBigcreator(true);
                setBigepi(false);
                setUpdateuser(false);
                setNewepisode(false);
              }}
              id='creator_creatorpodcast_btn'
            >
              Creator &amp; Podcast
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                setNewepisode(!newepisode);
                setBiguser(false);
                setBigcreator(false);
                setBigepi(true);
                setUpdateuser(false);
                setUpdatecreator(false);
              }}
              id='creator_episode_btn'
            >
              Episode
            </Button>
          </div>
        </div>
        <div>
          {biguser ? (
            updateuser ? (
              <Profile />
            ) : (
              <Updateuser setUpdateuser={setUpdateuser} />
            )
          ) : null}
        </div>
        <div>
          {bigcreator ? (
            updatcreator ? (
              <Creatorinfo creatorprofile={creatorprofile} />
            ) : (
              <Updatecreator creatorprofile={creatorprofile} />
            )
          ) : null}
        </div>
        <div></div>
        <div>
          <div>
            {bigepi ? (
              newepisode ? (
                <Episode creatorepisode={creatorepisode} />
              ) : (
                <Newepisode creatorprofile={creatorprofile} />
              )
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
};
export default Creator;
