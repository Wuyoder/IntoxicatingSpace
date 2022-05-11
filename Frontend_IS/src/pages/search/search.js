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
    <>
      <div className='search_shows'>
        {search.title[0] ? (
          <>
            <div className='sub_search' Style='margin:1vw; font-size:1.5em'>
              Match Podcast ' Title '
            </div>
            <Row xs={1} md={6} id='boot_row'>
              {search.title.map((item) => {
                return <Searchshow item={item} />;
              })}
            </Row>
          </>
        ) : null}
        {search.creator[0] ? (
          <>
            <div className='sub_search' Style='margin:1vw; font-size:1.5em'>
              Match Podcast ' Creator '
            </div>
            <Row xs={1} md={6} id='boot_row'>
              {search.creator.map((item) => {
                return <Searchshow item={item} />;
              })}
            </Row>
          </>
        ) : null}
        {search.cate[0] ? (
          <>
            <div className='sub_search' Style='margin:1vw; font-size:1.5em'>
              Match Podcast ' Category '
            </div>
            <Row xs={1} md={6} id='boot_row'>
              {search.cate.map((item) => {
                return <Searchshow item={item} />;
              })}
            </Row>
          </>
        ) : null}
      </div>
    </>
  );
};
export default Search;
