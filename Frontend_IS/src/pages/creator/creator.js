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
const Creator = () => {
  const [creatorprofile, setCreatorprofile] = useState([]);
  const [creatorepisode, setCreatorepisode] = useState([]);
  useEffect(() => {
    const getcreatorinfo = async () => {
      const res1 = await axios.get(CREATOR_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCreatorprofile(res1.data[0]);
      const res2 = await axios.get(ISHOST_SHOW, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCreatorepisode(res2.data);
    };
    getcreatorinfo();
  }, []);
  const [updateuser, setUpdateuser] = useState(true);
  const [updatcreator, setUpdatecreator] = useState(true);
  const [newepisode, setNewepisode] = useState(true);
  const [biguser, setBiguser] = useState(true);
  const [bigcreator, setBigcreator] = useState(false);
  const [bigepi, setBigepi] = useState(false);

  return (
    <div className='creator_container'>
      <div className='creator_btn_container'>
        <div>
          <div>
            <button
              Style='background-color:black'
              onClick={() => {
                setUpdateuser(!updateuser);
                setBiguser(true);
                setBigcreator(false);
                setBigepi(false);
                setUpdatecreator(false);
                setNewepisode(false);
              }}
              className='creator_btn'
            >
              User
            </button>
          </div>
        </div>
        <div>
          <button
            Style='background-color:black'
            onClick={() => {
              setUpdatecreator(!updatcreator);
              setBiguser(false);
              setBigcreator(true);
              setBigepi(false);
              setUpdateuser(false);
              setNewepisode(false);
            }}
            className='creator_btn'
          >
            Creator &amp; Podcast
          </button>
        </div>
        <div>
          <button
            Style='background-color:black'
            onClick={() => {
              setNewepisode(!newepisode);
              setBiguser(false);
              setBigcreator(false);
              setBigepi(true);
              setUpdateuser(false);
              setUpdatecreator(false);
            }}
            className='creator_btn'
          >
            Episode
          </button>
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
      <div>
        {/* {creatorepisode.map((item) => {
          return <Creatorepisode creatorepisode={item} />;
        })} */}
      </div>
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
  );
};
export default Creator;
