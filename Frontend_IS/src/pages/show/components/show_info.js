import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SHOWCHOICE } from '../../../global/constants';
import { AppContext } from '../../../App';
const ShowInfo = () => {
  const [info, setInfo] = useState([]);
  const { showid } = useContext(AppContext);
  useEffect(() => {
    const getInfo = async () => {
      const res = await axios.get(`${SHOWCHOICE}/${showid}`);
      setInfo(res.data);
    };
    getInfo();
  }, []);

  return (
    <div className='show_info_container'>
      <div className='show_info_l'>
        <div className='show_name'>{info.title}</div>
        <img
          className='show_image_choice'
          alt={info.title}
          src={info.itunes?.image}
        ></img>
        <div className='show_detail'>{info.itunes?.author}</div>
        <div className='show_detail'>{info.itunes?.categories[0]}</div>
      </div>
      <div className='show_info_r'>
        <div className='show_des'>{info.description}</div>
        <div Style='display:none' className='show_sub' id='sub_btn'>
          subscribe
        </div>
        <div id='show_episode'></div>
      </div>
    </div>
  );
};
export default ShowInfo;
