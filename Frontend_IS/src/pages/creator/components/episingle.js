const Episingle = ({ item, i }) => {
  return (
    <div className='single_epi_container'>
      <div>
        <img
          alt='episode_image'
          src={item.episode_image}
          Style='height: 150px'
        ></img>
      </div>
      <div className='single_epi_info'>
        <h3 className='single_epi_title'>{item.episode_title}</h3>
        <div className='single_epi_detail'>number: {i + 1}</div>
        <div className='single_epi_detail'>description: {item.episode_des}</div>
        <div className='single_epi_detail'>
          publish date:
          {(() => {
            let modiday = item.episode_publish_date.toString().slice(0, 10);
            let moditime = item.episode_publish_date
              .toString()
              .split('T')[1]
              .split('.')[0];
            return ` ${modiday} - ${moditime} `;
          })()}
        </div>
        <div className='single_epi_detail'>
          explicit: {item.episode_explicit === 0 ? <>no</> : <>yes</>}
        </div>
        <div></div>
      </div>
      <div>
        <button Style='background-color:black' className='btn_type'>
          Edit
        </button>
      </div>
    </div>
  );
};
export default Episingle;
