import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../App';
import axios from 'axios';
import { USER_HISTORY } from '../../../global/constants';
const Searchshow = ({ item }) => {
  const { showid, setShowid, setSearch } = useContext(AppContext);
  const goclickshow = async (event) => {
    setShowid(item.rss_id);
    const res = await axios.post(
      USER_HISTORY,
      { type: 'show', show: item.rss_id },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
  };
  return (
    <div key={`search-${item.rss_id}`}>
      <Link
        to={{
          pathname: `/showchoice/${item.rss_id}`,
          label: `${item.rss_id}`,
        }}
        onClick={goclickshow}
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
