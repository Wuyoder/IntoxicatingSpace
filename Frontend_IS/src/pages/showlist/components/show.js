import { v4 } from 'uuid';
import { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import React from 'react';
import { AppContext } from '../../../App';
import { USER_HISTORY } from '../../../global/constants';
import axios from 'axios';

const HotShow = ({ item }) => {
  const goclickshow = async (event) => {
    //setShowid(item.rss_id);
    //event.currentTarget.lastChild.innerHTML rss id
    const res = await axios.post(
      USER_HISTORY,
      { type: 'show', show: event.currentTarget.lastChild.innerHTML },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
  };

  return (
    <Container>
      <Col>
        <div key={`show-${item.rss_id}`}>
          <Link
            to={{
              pathname: `/showchoice/${item.rss_id}`,
              lable: `${item.rss_id}`,
            }}
            onClick={goclickshow}
          >
            <img
              src={item.rss_image}
              alt={item.title}
              show={item.title}
              className='show_image show'
            ></img>
            <div className='show_name show'>{item.rss_title}</div>
            <div Style='display:none'>{item.rss_id}</div>
          </Link>
          <div className='show_category show' Style='display:none'>
            {item.rss_category_main}
          </div>
        </div>
      </Col>
    </Container>
  );
};
const Show = { HotShow };
export default Show;
