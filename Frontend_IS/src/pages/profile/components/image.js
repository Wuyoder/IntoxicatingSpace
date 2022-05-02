const Image = () => {
  return (
    <img
      alt='user_image'
      src={localStorage.getItem('user_image')}
      id='update_userprofile_image'
    ></img>
  );
};
export default Image;
