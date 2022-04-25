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
        <div className='signup_title'>username</div>
        <input
          id='S_name'
          className='input_type'
          Style='background-color:black; color:white'
          required
        ></input>
        <div className='signup_title'>email</div>
        <input
          id='S_email'
          className='input_type'
          Style='background-color:black; color:white'
          required
        ></input>
        <div className='signup_title'>password</div>
        <input
          type='password'
          id='S_pwd'
          className='input_type'
          Style='background-color:black; color:white'
          required
        ></input>
        <div className='signup_title'>birthday</div>
        <input
          type='date'
          id='S_birth'
          className='input_type'
          Style='background-color:black; color:white'
          required
        ></input>
        <input
          type='button'
          value='signup'
          className='btn_type'
          Style='background-color:black'
          onClick={gosignup}
        ></input>
      </div>
    </>
  );
};
export default Signup;
