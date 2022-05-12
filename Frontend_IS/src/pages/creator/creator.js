import Creatorinfo from './components/creatorinfo';
import Creatorepisode from './components/creatorepisode';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CREATOR_PROFILE, ISHOST_SHOW } from '../../global/constants';
import Profile from '../profile/profile';
import Updateuser from '../profile/components/updateuser';
import Updatecreator from './components/updatecreator';
import Episode from '../creator/components/episode';
import Newepisode from '../creator/components/newepisode';
import { Button, Card } from '@mui/material';
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
      const res1 = await axios.get(CREATOR_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res1.data[0].user_id) {
        window.location.replace('/');
      }
      setCreatorprofile(res1.data[0]);
      const res2 = await axios.get(ISHOST_SHOW, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCreatorepisode(res2.data);
    };
    getcreatorinfo();
  }, [updateuser, updateuser, newepisode, biguser, bigcreator, bigepi]);

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
        <div>{biguser ? updateuser ? <Profile /> : <Updateuser /> : null}</div>
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
