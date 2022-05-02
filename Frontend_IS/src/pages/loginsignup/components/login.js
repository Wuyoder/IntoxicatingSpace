import axios from 'axios';
import { LOGIN } from '../../../global/constants';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  TextField,
} from '@mui/material';
const Login = () => {
  const gologin = async () => {
    const email = document.getElementById('L_email').value;
    const pwd = document.getElementById('L_pwd').value;
    const l_result = await axios.post(LOGIN, { email: email, pwd: pwd });
    if (l_result.data.error) {
      alert(l_result.data.error);
    }
    if (l_result.data.data) {
      console.log(l_result.data);
      localStorage.setItem('token', l_result.data.data.token);
      localStorage.setItem('user_image', l_result.data.data.user.image);
      localStorage.setItem('creator_image', l_result.data.data.show_image);
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
          <TextField id='L_email' label='E-mail'></TextField>
          <TextField
            id='L_pwd'
            type='password'
            onKeyDown={enter}
            label='Password'
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
