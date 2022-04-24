const Creatorinfo = ({ creatorprofile }) => {
  return (
    <>
      <div id='creator_info'>
        <div id='creator_name'>creator name: {creatorprofile.creator_name}</div>
        <div id='creator_email'>
          creator email: {creatorprofile.creator_email}
        </div>
        <div id='show_name'>show name: {creatorprofile.show_name}</div>
        <img
          id='show_image'
          alt='show_image'
          src={localStorage.getItem('creator_image')}
        ></img>
        <div>show description :{creatorprofile.show_des}</div>
        <div>show category: {creatorprofile.show_category_main}</div>
        <div id='show_rss'>
          rss feed url : https://intoxicating.space/rss/{creatorprofile.show_id}
        </div>
        <div id='show_last_update'>
          show last update: {creatorprofile.show_time_update}
        </div>
        <div id='show_subscriber'>
          subscriber: {creatorprofile.show_subscriber}
        </div>
      </div>
    </>
  );
};
export default Creatorinfo;
