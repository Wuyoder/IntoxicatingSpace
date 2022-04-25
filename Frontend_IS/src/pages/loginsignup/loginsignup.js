import Login from './components/login';
import Signup from './components/signup';

import { useState } from 'react';

const LoginSignup = () => {
  const [now, setNow] = useState(true);
  return (
    <div className='login_container'>
      <div>
        <button
          id='gologin'
          className='btn_type'
          Style='background-color:black'
          onClick={() => {
            setNow(true);
          }}
        >
          Go Login
        </button>
        <button
          id='gosignup'
          className='btn_type'
          Style='background-color:black'
          onClick={() => {
            setNow(false);
          }}
        >
          Go Signup
        </button>
      </div>
      {now ? <Login /> : <Signup />}
    </div>
  );
};
export default LoginSignup;
