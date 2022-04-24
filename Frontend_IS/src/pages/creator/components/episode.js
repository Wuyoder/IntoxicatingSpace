import Episingle from './episingle';
import axios from 'axios';
import { useState, useEffect } from 'react';
const Episode = ({ creatorepisode }) => {
  return (
    <div>
      {creatorepisode.map((item, i) => {
        return <Episingle item={item} i={i} />;
      })}
    </div>
  );
};
export default Episode;
