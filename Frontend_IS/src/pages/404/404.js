import salert from '../../util/salert';
const Notfound = () => {
  return (
    <>
      {salert(
        'error',
        <>
          <h4 id='alert'>Page Not Found.</h4>
          <h4>Redirect to HOME page</h4>
        </>
      ).then(setTimeout(window.location.replace('/'), 3500))}
      ;
    </>
  );
};
export default Notfound;
