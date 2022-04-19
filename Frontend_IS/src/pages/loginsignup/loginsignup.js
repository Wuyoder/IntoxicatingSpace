import Login from './components/login';
import Signup from './components/signup';

import { useState } from 'react';

const LoginSignup = () => {
  const [now, setNow] = useState(true);
  return (
    <>
      <div>
        <button
          Style='background-color:black'
          onClick={() => {
            setNow(true);
          }}
        >
          Login
        </button>
        <button
          Style='background-color:black'
          onClick={() => {
            setNow(false);
          }}
        >
          Signup
        </button>
      </div>
      {now ? <Login /> : <Signup />}
    </>
  );
};
export default LoginSignup;
