import { useState, useEffect } from 'react';
import { SHOWLIST } from '../../global/constants';
import Show from './components/show';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../../css/main.css';
import 'intro.js/introjs.css';
import ajax from '../../util/ajax';
const Showlist = () => {
  const [showlist, setShowlist] = useState({});
  useEffect(() => {
    const getShowlist = async () => {
      const res = await ajax('get', SHOWLIST);
      setShowlist(res.data);
    };
    getShowlist();
  }, []);

  return (
    <>
      <div id='showlist_container'>
        <div className='showlist_row'>
          <div class='show_list_title'>{showlist.topic1}</div>
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
          <div class='show_list_title'>{showlist.topic2}</div>
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
          <div class='show_list_title'>{showlist.topic3}</div>
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
