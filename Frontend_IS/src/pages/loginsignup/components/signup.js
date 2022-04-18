const Signup = () => {
  return (
    <>
      <div id='signup'>
        username<input id='S_name' required></input>
        email<input id='S_email' required></input>
        password<input type='password' id='S_pwd' required></input>
        birthday<input type='date' id='S_birth' required></input>
        <input id='S_btn' type='button' value='signup'></input>
      </div>
    </>
  );
};
export default Signup;
