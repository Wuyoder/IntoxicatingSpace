import { useState, useEffect, useRef } from 'react';
import { HOST_NAME, API_GET_DATA } from '../../global/constants';

import Edit from './components/edit';
import List from './components/list';

// async function fetchData(setData) {
//   const res = await fetch(API_GET_DATA);
//   const { data } = await res.json();
//   console.log(data);
//   setData(data);
//   //return data;
// }

// async function fetchSetData(data) {
//   await fetch(API_GET_DATA, {
//     method: 'PUT',
//     headers: { 'Content-type': 'application/json' },
//     body: JSON.stringify({ data }),
//   });
// }

const Home = () => {
  // const [data, setData] = useState([]);
  // const reference = useRef(false);

  // useEffect(() => {
  //   if (!reference.current) {
  //     return;
  //   }

  //   fetchSetData(data).then((data) => (reference.current = false));
  // }, [data]);

  // useEffect(() => {
  //   fetchData(setData);
  // }, []);

  return (
    <div>
      home
      {/* <Edit add={setData} reference={reference} />
      <List listData={data} deleteData={setData} reference={reference} /> */}
    </div>
  );
};
export default Home;
