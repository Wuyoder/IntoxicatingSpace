import { useState, useEffect, useContext } from 'react';
import { SHOWLIST } from '../../global/constants';
import axios from 'axios';
import Show from './components/show';
import Category from './components/category';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../../css/creator.css';
import '../../css/dashboard.css';
import '../../css/episode.css';
import '../../css/index.css';
import '../../css/login_signup.css';
import '../../css/play.css';
import '../../css/profile.css';
import '../../css/show.css';
import 'react-h5-audio-player/lib/styles.css';

import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
const Showlist = () => {
  // 取得useContext內容
  const { setShowid } = useContext(AppContext);
  // 可以一次取得多個再使用

  const [showlist, setShowlist] = useState([]);
  useEffect(() => {
    const getShowlist = async () => {
      const res = await axios.get(SHOWLIST);
      setShowlist(res.data);
    };
    getShowlist();
  }, []);
  const category = ['熱門', '推薦', '足跡'];
  return (
    <>
      <div>
        <Category category={category[0]} />
        <Row xs={6}>
          {showlist.map((item) => {
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
    </>
  );
};
export default Showlist;
