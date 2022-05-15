import Info from './components/info';
import Chatroom from './components/chatroom';
import { useState, useEffect } from 'react';
import Loading from '../loading/loading';
import axios from 'axios';
import { EPISODECHOICE } from '../../global/constants';
const Episode = () => {
  const [load, setLoad] = useState(true);
  const [info, setInfo] = useState([]);
  useEffect(() => {
    setLoad(true);
    const spinner = async () => {
      const res = await axios
        .get(
          `${EPISODECHOICE}/${
            window.location.pathname.split('/')[2].split('-')[0]
          }-${window.location.pathname.split('/')[2].split('-')[1]}`
        )
        .then((res) => {
          setInfo(res.data);
          if (!res.data.item) {
            window.location.replace(
              `/showchoice/${
                window.location.pathname.split('/')[2].split('-')[0]
              }`
            );
          }
          setLoad(false);
        });
    };
    spinner();
  }, []);

  return (
    <>
      {load ? (
        <div Style='margin:30vh 0 30vh 35vw'>
          <Loading />
        </div>
      ) : (
        <div id='chat_parts'>
          <div>
            <div>
              <Info info={info} />
            </div>
          </div>
          <Chatroom />
        </div>
      )}
    </>
  );
};
export default Episode;
