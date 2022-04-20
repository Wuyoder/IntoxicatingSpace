import axios from 'axios';
import { SIGNUP, LOGIN } from '../../../global/constants';

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
    <>
      <div id='signup'>
        username<input id='S_name' required></input>
        email<input id='S_email' required></input>
        password<input type='password' id='S_pwd' required></input>
        birthday<input type='date' id='S_birth' required></input>
        <input
          id='S_btn'
          type='button'
          value='signup'
          onClick={gosignup}
        ></input>
      </div>
    </>
  );
};
export default Signup;
