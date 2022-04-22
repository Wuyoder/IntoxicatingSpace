import Creatorinfo from './components/creatorinfo';
import Creatorepisode from './components/creatorepisode';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CREATOR_PROFILE, ISHOST_SHOW } from '../../global/constants';

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

  return (
    <>
      <div>
        <Creatorinfo creatorprofile={creatorprofile} />
      </div>
      <div>
        {creatorepisode?.map((item) => {
          return <Creatorepisode creatorepisode={item} />;
        })}
      </div>
    </>
  );
};
export default Creator;
