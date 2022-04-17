const ShowInfo = ({ showinfo }) => {
  console.log('showinfo');
  console.log('showinfo', showinfo);
  return (
    <>
      <div className='show_name'>{showinfo.title}</div>
      <div className='show_detail'>{showinfo.itunes.author}</div>
      <img
        className='show_image'
        alt={showinfo.title}
        src={showinfo.itunes.image}
      ></img>
      <div className='show_detail'>{showinfo.itunes.categories[0]}</div>
      <div className='show_detail'>{showinfo.description}</div>
      <div className='show_sub' id='sub_btn'>
        subscribe
      </div>
      <div id='show_episode'></div>
    </>
  );
};
export default ShowInfo;
