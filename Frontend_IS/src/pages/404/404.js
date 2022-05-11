import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const Notfound = () => {
  const MySwal = withReactContent(Swal);
  return (
    <>
      {MySwal.fire({
        icon: 'error',
        title: (
          <>
            <h4 id='alert'>Page Not Found.</h4>
            <h4>Redirect to HOME page</h4>
          </>
        ),
      }).then(setTimeout(window.location.replace('/'), 3500))}
      ;
    </>
  );
};
export default Notfound;
