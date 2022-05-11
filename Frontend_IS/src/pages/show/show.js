import ShowInfo from './components/show_info';
import ShowEpisode from './components/show_episode';
import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { SHOWCHOICE } from '../../global/constants';

const Showchoice = () => {
  useEffect(() => {
    const getInfo = async () => {
      const res = await axios.get(
        `${SHOWCHOICE}/${window.location.pathname.slice(12)}`
      );
      if (res.data.status) {
        window.location.replace('/');
      }
    };
    getInfo();
  }, []);

  return (
    <div>
      <ShowInfo />
      <br />
      <ShowEpisode />
    </div>
  );
};
export default Showchoice;
