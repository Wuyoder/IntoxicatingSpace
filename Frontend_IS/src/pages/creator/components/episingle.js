import { useEffect, useState } from 'react';
import axios from 'axios';
import { S3, UPDATE_EPI, SWITCHER } from '../../../global/constants';
const Episingle = ({ item, i }) => {
  const [edit, setEdit] = useState(true);
  const [episitu, setEpisitu] = useState(true);
  const goedit = () => {
    setEdit(!edit);
  };
  useEffect(() => {
    if (item.episode_status === 1) {
      setEpisitu(true);
    } else {
      setEpisitu(false);
    }
  }, [item.episode_status]);

  const [duration, setDuration] = useState(0);
  const getduration = () => {
    let epifile = document.getElementById('newepi_file');
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      setDuration(Math.round(video.duration));
      console.log(duration);
    };
    video.src = URL.createObjectURL(epifile.files[0]);
  };

  const goupdateepi = async () => {
    const file = document.getElementById('newepi_file');
    const image = document.getElementById('newepi_image');
    const title = document.getElementById('newepi_title');
    const des = document.getElementById('newepi_des');
    const explicit = document.getElementById('newepi_explicit');
    const episode = document.getElementById('newepi_episode');

    if (
      file.files[0] === undefined &&
      image.files[0] === undefined &&
      title.value === '' &&
      des.value === '' &&
      explicit.value === item.episode_explicit.toString() &&
      episode.value === item.episode_episode.toString()
    ) {
      alert('nothing change');
      console.log('nothing');
    } else {
      let fileurl = '';
      let imageurl = '';
      let length = '';
      if (file.files[0]) {
        length = file.files[0].size;
        const res1 = await axios.post(
          S3,
          { type: 'episode_file', episode_num: item.episode_id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        fileurl = res1.data.presignedURL.split('?')[0];
        const s3res1 = await axios.put(res1.data.presignedURL, file.files[0], {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            var percentCompleted = Math.round((e.loaded * 100) / e.total);
            if (percentCompleted < 100) {
              document.getElementById(
                'uploadPercent1'
              ).innerHTML = `${percentCompleted}%`;
            } else {
              document.getElementById('uploadPercent1').innerHTML =
                'completed!';
            }
            console.log('file', percentCompleted);
          },
        });
      }

      if (image.files[0]) {
        const res2 = await axios.post(
          S3,
          { type: 'episode_image', episode_num: item.episode_id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        imageurl = res2.data.presignedURL.split('?')[0];
        item.episode_image = imageurl;
        const s3res2 = await axios.put(res2.data.presignedURL, image.files[0], {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            var percentCompleted = Math.round((e.loaded * 100) / e.total);
            if (percentCompleted < 100) {
              document.getElementById(
                'uploadPercent2'
              ).innerHTML = `${percentCompleted}%`;
            } else {
              document.getElementById('uploadPercent2').innerHTML =
                'completed!';
            }
            console.log('image', percentCompleted);
          },
        });
      }
      const updateepi = {
        show_id: item.show_id,
        episode_id: item.episode_id,
        title: title.value,
        des: des.value,
        file: fileurl,
        duration: duration,
        length: length,
        image: imageurl,
        explicit: explicit.value,
        episode: episode.value,
      };
      const updateres = await axios.put(UPDATE_EPI, updateepi, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!updateres.data.error) {
        alert('new episode already published');
      }
      if (title.value !== '') {
        item.episode_title = title.value;
      }
      if (episode.value !== '') {
        item.episode_episode = episode.value;
      }
      if (des.value !== '') {
        item.episode_des = des.value;
      }
      item.episode_explicit = explicit.value;

      document.getElementById('newepi_title').value = '';
      document.getElementById('newepi_des').value = '';
      document.getElementById('newepi_explicit').value = '';
      document.getElementById('newepi_episode').value = '';
      console.log(updateres);
    }
  };

  const goswitch = async () => {
    const res = await axios.post(
      SWITCHER,
      {
        type: 'episode',
        show_id: item.show_id,
        episode_id: item.episode_id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    setEpisitu(!episitu);
  };

  return (
    <div className='single_epi_container'>
      <button
        onClick={goedit}
        Style='background-color:black'
        className='btn_type'
      >
        Edit
      </button>
      {edit ? (
        <div>
          <div>
            <img
              alt='episode_image'
              src={item.episode_image}
              Style='height: 150px'
            ></img>
          </div>
          <div className='single_epi_info'>
            <h3 className='single_epi_title'>{item.episode_title}</h3>
            <div className='single_epi_detail'>
              number: {item.episode_episode}
            </div>
            <div className='single_epi_detail'>
              description: {item.episode_des}
            </div>
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
            </div>{' '}
            Status :{episitu ? <div>ON</div> : <div>OFF</div>}
          </div>
        </div>
      ) : (
        <>
          <div>
            <div>title</div>
            <input id='newepi_title' Style='background-color:black'></input>
            <div>description</div>
            <input id='newepi_des' Style='background-color:black'></input>
            <div>file</div>
            <input
              type='file'
              id='newepi_file'
              Style='background-color:black'
              accept='audio/*'
              onChange={getduration}
            ></input>
            <div id='uploadPercent1'></div>
            <div></div>
            <div>explicit</div>
            <select id='newepi_explicit' Style='background-color:black'>
              <option value='0'>no</option>
              <option value='1'>yes</option>
            </select>
            <div>image</div>
            <input
              type='file'
              id='newepi_image'
              Style='background-color:black'
              accept='image/*'
            ></input>
            <div id='uploadPercent2'></div>
            <div>episode</div>
            <input
              //placeholder={item.episode_episode}
              type='number'
              min='1'
              step='1'
              id='newepi_episode'
              Style='background-color:black'
            ></input>
            <div>
              <button Style='background-color:black' onClick={goupdateepi}>
                update episode
              </button>
            </div>
            {episitu ? (
              <button Style='background-color:black' onClick={goswitch}>
                ON
              </button>
            ) : (
              <button Style='background-color:black' onClick={goswitch}>
                OFF
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default Episingle;
