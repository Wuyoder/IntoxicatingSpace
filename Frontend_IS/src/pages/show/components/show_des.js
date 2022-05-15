import { useState, useEffect } from 'react';
const ShowDes = ({ info }) => {
  const [des, setDes] = useState([]);
  useEffect(() => {
    setDes(info.des);
  }, []);
  const destext = () => {
    return { __html: info.description };
  };
  return (
    <>
      <div dangerouslySetInnerHTML={destext()}></div>
    </>
  );
};
export default ShowDes;
