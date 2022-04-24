const Creatorinfo = ({ creatorprofile }) => {
  return (
    <div className='cp_container'>
      <div id='creator_name' className='creator_type'>
        creator name : {creatorprofile.creator_name}
      </div>
      <div id='creator_email' className='creator_type'>
        creator email : {creatorprofile.creator_email}
      </div>
      <div id='show_name' className='creator_type'>
        show name : {creatorprofile.show_name}
      </div>
      <div className='creator_type'>
        <img
          id='show_image'
          alt='show_image'
          src={localStorage.getItem('creator_image')}
        ></img>
      </div>
      <div className='creator_type'>
        show description : {creatorprofile.show_des}
      </div>
      <div className='creator_type'>
        show category : {creatorprofile.show_category_main}
      </div>
      <div id='show_rss' className='creator_type'>
        rss feed url : https://intoxicating.space/rss/{creatorprofile.show_id}
      </div>
      <div id='show_last_update' className='creator_type'>
        show last update : {creatorprofile.show_time_update}
      </div>
      <div id='show_subscriber' className='creator_type'>
        subscriber : {creatorprofile.show_subscriber}
      </div>
    </div>
  );
};
export default Creatorinfo;
