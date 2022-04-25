import { useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import Searchshow from './components/searchshow';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
const Search = () => {
  const { search, setSearch } = useContext(AppContext);

  if (search.error) {
    return (
      <div className='search_nomatch'>
        <h1>No Matching Podcast Found.</h1>
        <h2>please try other keywords</h2>
      </div>
    );
  }

  return (
    <div className='search_shows'>
      <Row xs={1} md={6} id='boot_row'>
        {search.map((item) => {
          return <Searchshow item={item} />;
        })}
      </Row>
    </div>
  );
};
export default Search;
