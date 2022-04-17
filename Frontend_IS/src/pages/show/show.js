import { useEffect, useState, useLayoutEffect } from 'react';
import axios from 'axios';
import { SHOW } from '../../global/constants';
import ShowInfo from './components/show_info';
import ShowEpisode from './components/show_episode';
import React from 'react';
import { Link } from 'react-router-dom';
const Showchoice = () => {
  console.log('into Showchoice');
  const [show, setShow] = useState([]);

  useEffect(() => {
    const getShow = async () => {
      const res = await axios.get(`${SHOW}/3`);
      setShow(res.data);
    };
    getShow();
  }, []);

  console.log(show);

  return (
    <div>
      123
      <ShowInfo showinfo={show} />
      <ShowEpisode items={show.items} />
      {/* <Link to='/showchoice'></Link> */}
    </div>
  );
};
export default Showchoice;
