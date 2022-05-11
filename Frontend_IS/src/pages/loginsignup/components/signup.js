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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const Signup = () => {
  const MySwal = withReactContent(Swal);
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
      MySwal.fire({
        title: (
          <>
            <h4 className='alert'>{s_result.data.error}</h4>
          </>
        ),
      });
    }
    if (s_result.data.status) {
      MySwal.fire({
        title: (
          <>
            <h4 className='alert'>Please Sign in.</h4>
          </>
        ),
        didOpen: () => {
          MySwal.showLoading();
        },
      });
      window.location.replace('/login');
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
