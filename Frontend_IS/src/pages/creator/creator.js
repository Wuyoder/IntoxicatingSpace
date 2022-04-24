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
  return (
    <>
      <div>
        <div>
          <button
            Style='background-color:black'
            onClick={() => {
              setUpdateuser(!updateuser);
            }}
          >
            set user
          </button>
        </div>
        <div>
          <button
            Style='background-color:black'
            onClick={() => {
              setUpdatecreator(!updatcreator);
            }}
          >
            set creator
          </button>
        </div>
        <div>
          <button
            Style='background-color:black'
            onClick={() => {
              setNewepisode(!newepisode);
            }}
          >
            new episode
          </button>
        </div>
      </div>
      <div>{updateuser ? <Profile /> : <Updateuser />}</div>
      <div>
        {updatcreator ? (
          <Creatorinfo creatorprofile={creatorprofile} />
        ) : (
          <Updatecreator creatorprofile={creatorprofile} />
        )}
      </div>
      <div>
        {/* {creatorepisode.map((item) => {
          return <Creatorepisode creatorepisode={item} />;
        })} */}
      </div>
      <div>
        <div>
          {newepisode ? (
            <Episode creatorepisode={creatorepisode} />
          ) : (
            <Newepisode creatorprofile={creatorprofile} />
          )}
        </div>
      </div>
    </>
  );
};
export default Creator;
