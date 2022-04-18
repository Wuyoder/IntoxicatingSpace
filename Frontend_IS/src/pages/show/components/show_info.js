import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SHOW } from '../../../global/constants';
import { AppContext } from '../../../App';
const ShowInfo = () => {
  const [info, setInfo] = useState([]);
  const { showid } = useContext(AppContext);
  useEffect(() => {
    const getInfo = async () => {
      const res = await axios.get(`${SHOW}/${showid}`);
      setInfo(res.data);
    };
    getInfo();
  }, []);

  return (
    <div>
      <div className='show_name'>{info.title}</div>
      <div className='show_detail'>{info.itunes?.author}</div>
      <img
        className='show_image'
        alt={info.title}
        src={info.itunes?.image}
      ></img>
      <div className='show_detail'>{info.itunes?.categories[0]}</div>
      <div className='show_detail'>{info.description}</div>
      <div className='show_sub' id='sub_btn'>
        subscribe
      </div>
      <div id='show_episode'></div>
    </div>
  );
};
export default ShowInfo;
