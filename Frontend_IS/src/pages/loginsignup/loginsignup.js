import Login from './components/login';
import Signup from './components/signup';
import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  TextField,
} from '@mui/material';
const LoginSignup = () => {
  const [now, setNow] = useState(true);
  return (
    <Card variant='outlined' id='login_container'>
      <div id='login_signup_container'>
        <Button
          id='gologin'
          onClick={() => {
            setNow(true);
          }}
        >
          Go Login
        </Button>
        <Button
          id='gosignup'
          onClick={() => {
            setNow(false);
          }}
        >
          Go Signup
        </Button>
      </div>
      <div>{now ? <Login /> : <Signup />}</div>
    </Card>
  );
};
export default LoginSignup;
