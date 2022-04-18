import { v4 } from 'uuid';
import { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import React from 'react';
import { AppContext } from '../../../App';

// 可以一次取得多個再使用
const HotShow = ({ item, setGopages }) => {
  // 取得useContext內容
  const { showid, setShowid } = useContext(AppContext);
  // 可以一次取得多個再使用

  return (
    <Container>
      <Col>
        <div key={v4()}>
          <Link
            to='/showchoice'
            onClick={(event) => {
              setShowid(item.rss_id);
              console.log('showid', showid);
              console.log(
                'event.target',
                event.currentTarget.lastChild.innerHTML
              );
            }}
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
          <div className='show_category show'>{item.rss_category_main}</div>
        </div>
      </Col>
    </Container>
  );
};
const Show = { HotShow };
export default Show;
