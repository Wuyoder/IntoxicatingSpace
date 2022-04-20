import Creatorinfo from './components/creatorinfo';
import Creatorepisode from './components/creatorepisode';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CREATOR_PROFILE } from '../../global/constants';

const Creator = () => {
  const [creatorprofile, setCreatorprofile] = useState([]);
  useEffect(() => {
    const getcreatorprofile = async () => {
      const res = await axios.get(CREATOR_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(res.data[0]);
      setCreatorprofile(res.data[0]);
    };
    getcreatorprofile();
  }, []);

  console.log(creatorprofile);

  return (
    <>
      <Creatorinfo />
      <Creatorepisode />
    </>
  );
};
export default Creator;
