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
import '../../css/index.css';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
// 取得useContext內容
const TodoItem = () => {
  const { test, setRoutertry } = useContext(AppContext);
  console.log('test', test);
  return { test, setRoutertry };
};
// 可以一次取得多個再使用
const Showlist = ({ setGopages }) => {
  const [showlist, setShowlist] = useState([]);

  useEffect(() => {
    const getShowlist = async () => {
      const res = await axios.get(SHOWLIST);
      setShowlist(res.data);
    };
    getShowlist();
  }, []);

  return (
    <div>
      <Category />
      <div>{TodoItem().test}</div>
      <Row xs={6}>
        {showlist.map((item) => {
          return (
            <Col>
              <Show.HotShow item={item} setGopages={setGopages} />
            </Col>
          );
        })}
      </Row>
      <Link to='/'></Link>
    </div>
  );
};
export default Showlist;
