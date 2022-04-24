import { useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import Searchshow from './components/searchshow';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
const Search = () => {
  const { search, setSearch } = useContext(AppContext);
  console.log('into search page');
  console.log(search);

  if (search.error) {
    console.log(search);

    return (
      <div>
        <h1>No matching records found.</h1>
        <h2>Please try other keywords</h2>
      </div>
    );
  }

  console.log('match keyword', search);
  return (
    <div>
      <Row xs={6}>
        <>
          <Col>
            {search.map((item) => {
              return <Searchshow item={item} />;
            })}
          </Col>
        </>
      </Row>
    </div>
  );
};
export default Search;