import { v4 } from 'uuid';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { AppContext } from '../../../App';
const Searchshow = ({ item }) => {
  const { showid, setShowid, setSearch } = useContext(AppContext);

  return (
    <div key={`search-${item.rss_id}`}>
      <Link
        to={{
          pathname: `/showchoice/${item.rss_id}`,
          label: `${item.rss_id}`,
        }}
        onClick={(event) => {
          setShowid(item.rss_id);
        }}
        Style='text-decoration:none'
      >
        <img
          src={item.rss_image}
          alt={item.title}
          show={item.title}
          className='show_image show'
        ></img>
        <div className='search-show_name show'>{item.rss_title}</div>
        <div Style='display:none'>{item.rss_id}</div>
      </Link>
      <div className='search_show_category show'>{item.rss_category_main}</div>
    </div>
  );
};
export default Searchshow;
