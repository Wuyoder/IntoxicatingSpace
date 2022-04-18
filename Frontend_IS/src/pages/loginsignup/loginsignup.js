import Login from './components/login';
import Signup from './components/signup';

import { useState } from 'react';

const LoginSignup = () => {
  const [now, setNow] = useState(true);
  return (
    <>
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
      {now ? <Login /> : <Signup />}
    </>
  );
};
export default LoginSignup;
