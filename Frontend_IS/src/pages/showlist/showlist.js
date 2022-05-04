import { useState, useEffect } from 'react';
import { SHOWLIST } from '../../global/constants';
import axios from 'axios';
import Show from './components/show';
import Category from './components/category';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../../css/main.css';

const Showlist = () => {
  const [showlist, setShowlist] = useState({});
  useEffect(() => {
    const getShowlist = async () => {
      const res = await axios.get(SHOWLIST);
      setShowlist(res.data);
    };
    getShowlist();
  }, []);

  return (
    <>
      <div id='showlist_container'>
        <div className='showlist_row'>
          <Category category={showlist.topic1} />
          <Row xs={6}>
            {showlist.showlist_1?.map((item) => {
              return (
                <>
                  <Col>
                    <Show.HotShow item={item} />
                  </Col>
                </>
              );
            })}
          </Row>
        </div>
        <div className='showlist_row'>
          <Category category={showlist.topic2} />
          <Row xs={6}>
            {showlist.showlist_2?.map((item) => {
              return (
                <>
                  <Col>
                    <Show.HotShow item={item} />
                  </Col>
                </>
              );
            })}
          </Row>
        </div>
        <div className='showlist_row'>
          <Category category={showlist.topic3} />
          <Row xs={6}>
            {showlist.showlist_3?.map((item) => {
              return (
                <>
                  <Col>
                    <Show.HotShow item={item} />
                  </Col>
                </>
              );
            })}
          </Row>
        </div>
      </div>
    </>
  );
};
export default Showlist;
