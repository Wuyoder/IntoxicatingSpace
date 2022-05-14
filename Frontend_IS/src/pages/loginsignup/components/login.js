import axios from 'axios';
import { LOGIN } from '../../../global/constants';
import { Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const Login = () => {
  const MySwal = withReactContent(Swal);
  const gologin = async () => {
    const email = document.getElementById('L_email').value;
    const pwd = document.getElementById('L_pwd').value;
    const l_result = await axios.post(LOGIN, { email: email, pwd: pwd });
    if (l_result.data.error) {
      MySwal.fire({
        title: (
          <>
            <h4 className='alert'>{l_result.data.error}</h4>
          </>
        ),
      });
    }
    if (l_result.data.data) {
      localStorage.setItem('token', l_result.data.data.token);
      localStorage.setItem('user_image', l_result.data.data.user.image);
      localStorage.setItem('creator_image', l_result.data.data.show_image);
      MySwal.fire({
        title: (
          <>
            <h4 className='alert'>Intoxicating Space.</h4>
          </>
        ),
        didOpen: () => {
          MySwal.showLoading();
        },
      });
      window.location.replace('/');
    }
  };

  const enter = (e) => {
    const pwd = document.getElementById('L_pwd').value;
    if (e.key === 'Enter' && pwd !== '') {
      document.getElementById('login_submit').click();
    }
  };

  return (
    <>
      <div id='login'>
        <div id='login_l'>
          <div className='signup_title'>E-mail</div>
          <div className='signup_title'>Password</div>
        </div>
        <div id='login_r'>
          <TextField
            id='L_email'
            label='E-mail'
            defaultValue={'test@test.com'}
          ></TextField>
          <TextField
            id='L_pwd'
            type='password'
            label='Password'
            onKeyDown={enter}
            defaultValue={'testtest'}
          ></TextField>
        </div>
      </div>
      <Button id='login_submit' onClick={gologin}>
        LOGIN
      </Button>
    </>
  );
};
export default Login;
