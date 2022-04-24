import axios from 'axios';
import { LOGIN } from '../../../global/constants';

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

  return (
    <>
      <div id='login'>
        email<input id='L_email' required></input>
        password<input id='L_pwd' type='password' required></input>
        <input id='L_btn' type='button' value='login' onClick={gologin}></input>
      </div>
    </>
  );
};
export default Login;
