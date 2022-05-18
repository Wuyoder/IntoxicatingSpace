import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../App';
import { USER_HISTORY } from '../../../global/constants';
import ajax from '../../../util/ajax';
const Searchshow = ({ item }) => {
  const { setShowid } = useContext(AppContext);
  const goclickshow = async (event) => {
    setShowid(item.rss_id);
    const res = await ajax('post', USER_HISTORY, {
      type: 'show',
      show: item.rss_id,
    });
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
