const Image = () => {
  return (
    <img
      id='user_image'
      alt='user_image'
      src={localStorage.getItem('user_image')}
    ></img>
  );
};
export default Image;
