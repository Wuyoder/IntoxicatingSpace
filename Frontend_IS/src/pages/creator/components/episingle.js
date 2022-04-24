const Episingle = ({ item, i }) => {
  return (
    <div>
      <img
        alt='episode_image'
        src={item.episode_image}
        Style='height: 150px'
      ></img>
      <h3>title: {item.episode_title}</h3>
      <div>number: {i + 1}</div>
      <div>description: {item.episode_des}</div>
      <div>publish date: {item.episode_publish_date}</div>
      <div>explicit: {item.episode_explicit === 0 ? <>no</> : <>yes</>}</div>
      <div>-----------------------</div>
    </div>
  );
};
export default Episingle;
