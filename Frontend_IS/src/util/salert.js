import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const salert = (icon, title, param) => {
  const MySwal = withReactContent(Swal);
  if (icon === 'upload') {
    return MySwal.fire({
      icon: 'info',
      title: (
        <>
          <h4 id='alert'>Please Wait For Uploading.</h4>
          <div id='waitpercent'></div>
        </>
      ),
      //showConfirmButton: false,
      allowOutsideClick: false,
      //allowEscapeKey: false,
    });
  } else if (icon === 'loading') {
    return MySwal.fire({
      timer: 1500,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  } else if (icon === 'hint') {
    return MySwal.fire({
      title: (
        <>
          <h4 className='alert'>{param}</h4>
        </>
      ),
    });
  } else if (icon === 'open') {
    return MySwal.fire({
      title: (
        <>
          <h4 className='alert'>Intoxicating Space.</h4>
        </>
      ),
      didOpen: () => {
        MySwal.showLoading();
      },
    });
  } else if (icon === 'signin') {
    return MySwal.fire({
      title: (
        <>
          <h4 className='alert'>Please Sign in.</h4>
        </>
      ),
      didOpen: () => {
        MySwal.showLoading();
      },
    });
  } else if (icon === 'errorMsg') {
    return MySwal.fire({
      icon: 'error',
      title: <h4 id='alert'>{param}</h4>,
    });
  } else if (icon === 'seeya') {
    return MySwal.fire({
      title: (
        <>
          <h4 className='alert'>SeeYa</h4>
        </>
      ),
      didOpen: () => {
        MySwal.showLoading();
      },
    });
  } else {
    return MySwal.fire({
      icon: icon,
      title: title,
    });
  }
};
export default salert;
