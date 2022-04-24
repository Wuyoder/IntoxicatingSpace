import { v4 } from 'uuid';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { AppContext } from '../../../App';
const Searchshow = ({ item }) => {
  console.log('data to show search');
  console.log(item);
  const { showid, setShowid, setSearch } = useContext(AppContext);

  return (
    <Container>
      <Col>
        <div key={v4()}>
          <Link
            to={{
              pathname: '/showchoice',
              hash: `${item.rss_id}`,
            }}
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
export default Searchshow;
