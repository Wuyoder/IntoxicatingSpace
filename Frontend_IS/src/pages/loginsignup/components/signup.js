import axios from 'axios';
import { SIGNUP, LOGIN } from '../../../global/constants';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  TextField,
} from '@mui/material';
const Signup = () => {
  const gosignup = async () => {
    const name = document.getElementById('S_name').value;
    const email = document.getElementById('S_email').value;
    const pwd = document.getElementById('S_pwd').value;
    const birth = document.getElementById('S_birth').value;
    const s_result = await axios.post(SIGNUP, {
      name: name,
      email: email,
      pwd: pwd,
      birth: birth,
    });
    if (s_result.data.error) {
      alert(s_result.data.error);
    }
    if (s_result.data.status) {
      console.log(s_result);
      alert(s_result.data.status);
    }
  };

  return (
    <div>
      <div id='signup'>
        <div id='signup_l'>
          <div className='signup_title'>Username</div>
          <div className='signup_title'>E-mail</div>
          <div className='signup_title'>Password</div>
          <div className='signup_title'>Birthday</div>
        </div>
        <div id='signup_r'>
          <TextField id='S_name' label='Username'></TextField>
          <TextField id='S_email' label='E-mail'></TextField>
          <TextField type='password' id='S_pwd' label='Password'></TextField>
          <TextField
            type='date'
            id='S_birth'
            placeholder='YYYY/MM/DD'
            label='Birthday'
          ></TextField>
        </div>
      </div>
      <Button onClick={gosignup} id='signup_submit'>
        SIGNUP
      </Button>
    </div>
  );
};
export default Signup;
