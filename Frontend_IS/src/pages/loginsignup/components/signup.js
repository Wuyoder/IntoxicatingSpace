import { SIGNUP } from '../../../global/constants';
import { Button, TextField } from '@mui/material';
import ajax from '../../../util/ajax';
import salert from '../../../util/salert';
const Signup = () => {
  const gosignup = async () => {
    const name = document.getElementById('S_name').value;
    const email = document.getElementById('S_email').value;
    const pwd = document.getElementById('S_pwd').value;
    const birth = document.getElementById('S_birth').value;
    const s_result = await ajax('post', SIGNUP, {
      name: name,
      email: email,
      pwd: pwd,
      birth: birth,
    });
    if (s_result.data.error) {
      salert('hint', {}, s_result.data.error);
    }
    if (s_result.data.status) {
      salert('signin');
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
