import { SHOWLIST } from '../../../global/constants';
import axios from 'axios';
import { v4 } from 'uuid';
import { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
// 取得useContext內容
const TodoItem = () => {
  const { test, setRoutertry } = useContext(AppContext);
  console.log('test', test);
  return { test, setRoutertry };
};
// 可以一次取得多個再使用
const HotShow = ({ item, setGopages }) => {
  function test() {
    setGopages(function (prev) {
      return (prev += 1);
    });
  }

  const ABOUT = () => {
    const navigate = useNavigate();
    const onClick = () => {
      navigate('/profile');
    };
    return (
      <div>
        <button onClick={onClick}>BACK</button>
      </div>
    );
  };

  return (
    <Container>
      <Col>
        <div key={v4()}>
          <img
            src={item.rss_image}
            alt={item.title}
            className='show_image show'
            onClick={TodoItem().setRoutertry(4)}
          ></img>
          <div>{ABOUT()}</div>
          <div className='show_name show'>{item.rss_title}</div>
          <div className='show_category show'>{item.rss_category_main}</div>
        </div>
      </Col>
    </Container>
  );
};
const Show = { HotShow };
export default Show;
