import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  S3,
  UPDATE_EPI,
  SWITCHER,
  DELETE_EPI,
} from '../../../global/constants';
import { Button, Card, TextField } from '@mui/material';
import { AppContext } from '../../../App';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Step from '../../step/steps';
const Episingle = ({ item, i }) => {
  const MySwal = withReactContent(Swal);
  const [edit, setEdit] = useState(true);
  const [episitu, setEpisitu] = useState(true);
  const [explicit, setExplicit] = useState(true);
  const [delepi, setDelepi] = useState(true);
  const [imgfile, setImgfile] = useState([]);
  const [audiofile, setAudiofile] = useState([]);

  const goedit = () => {
    setEdit(!edit);
  };
  useEffect(() => {
    if (item.episode_explicit === 1) {
      setExplicit(false);
    } else {
      setExplicit(true);
    }
  }, [item.episode_status]);
  useEffect(() => {
    if (item.episode_status === 1) {
      setEpisitu(true);
    } else {
      setEpisitu(false);
    }
  }, [item.episode_status]);
  const [duration, setDuration] = useState(0);

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
      MySwal.fire({
        icon: 'error',
        title: (
          <>
            <h4 id='alert'>Nothing Changed.</h4>
          </>
        ),
      });
    } else {
      let fileurl = '';
      let imageurl = '';
      let length = '';

      if (file.files[0]) {
        MySwal.fire({
          icon: 'info',
          title: (
            <>
              <h4 id='alert'>Please Wait For Uploading.</h4>
              <div id='waitpercent'></div>
            </>
          ),
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
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
                'waitpercent'
              ).innerHTML = `${percentCompleted}%`;
            } else {
              document.getElementById('waitpercent').innerHTML = 'completed!';
            }
          },
        });
      }

      if (image.files[0]) {
        MySwal.fire({
          icon: 'info',
          title: (
            <>
              <h4 id='alert'>Please Wait For Uploading.</h4>
              <div id='waitpercent'></div>
            </>
          ),
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
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
                'waitpercent'
              ).innerHTML = `${percentCompleted}%`;
            } else {
              document.getElementById('waitpercent').innerHTML = 'completed!';
            }
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
      setDuration(0);
      item.episode_title = updateres.data.episode_episode;
      item.episode_episode = updateres.data.episode_title;
      item.episode_des = updateres.data.episode_des;
      if (updateres.data.episode_explicit === 0) {
        setExplicit(true);
      } else {
        setExplicit(false);
      }
      document.getElementById('newepi_title').value = '';
      document.getElementById('newepi_des').value = '';
      document.getElementById('newepi_explicit').value = '';
      document.getElementById('newepi_episode').value = '';
      if (updateres.data.error) {
        MySwal.fire({
          icon: 'error',
          title: <h4 id='alert'>{updateres.data.error}</h4>,
        });
      } else {
        MySwal.fire({
          icon: 'success',
          title: <h4 id='alert'>Episode Info Changed.</h4>,
        });
      }
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
  const goremove = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axios.delete(DELETE_EPI, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          data: { episode_id: item.episode_id },
        });
        if (res.data.status) {
          setDelepi(false);
        }
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };

  const getduration = () => {
    if (document.getElementById('newepi_file').files[0]) {
      setAudiofile(document.getElementById('newepi_file').files[0].name);
    } else {
      setAudiofile('');
    }
    let epifile = document.getElementById('newepi_file');
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      setDuration(Math.round(video.duration));
    };
    video.src = URL.createObjectURL(epifile.files[0]);
  };

  const goaudiofile = () => {
    document.getElementById('newepi_file').click();
  };
  const goimagefile = () => {
    document.getElementById('newepi_image').click();
  };

  const nowimagename = () => {
    if (document.getElementById('newepi_image').files[0]) {
      setImgfile(document.getElementById('newepi_image').files[0].name);
    } else {
      setImgfile('');
    }
  };

  return (
    <Card variant='outlined' className='single_epi_card'>
      {delepi ? (
        <Button onClick={goedit} id='single_epi_edit'>
          Edit
        </Button>
      ) : null}
      <div className='single_epi_container'>
        {delepi ? (
          edit ? (
            <>
              <Step.StepEpi />
              <div id='single_epi_parts'>
                <div>
                  <img
                    alt='episode_image'
                    src={item.episode_image}
                    Style='height: 150px'
                  ></img>
                </div>
                <div className='single_epi_info'>
                  <div id='single_epi_info_l'>
                    <div className='single_epi_detail'>Title</div>
                    <div className='single_epi_detail'>Number</div>
                    <div className='single_epi_detail'>Description</div>
                    <div className='single_epi_detail'>Pubdate</div>
                    <div className='single_epi_detail'>Explicit</div>
                    <div className='single_epi_detail'>Status</div>
                  </div>
                  <div id='single_epi_info_r'>
                    <div className='single_epi_details'>
                      {item.episode_title}
                    </div>
                    <div className='single_epi_details'>
                      {item.episode_episode}
                    </div>
                    <div className='single_epi_details'>{item.episode_des}</div>
                    <div className='single_epi_details'>
                      {(() => {
                        let modiday = item.episode_publish_date
                          .toString()
                          .slice(0, 10);
                        let moditime = item.episode_publish_date
                          .toString()
                          .split('T')[1]
                          .split('.')[0];
                        return ` ${modiday} - ${moditime} `;
                      })()}
                    </div>
                    <div className='single_epi_details'>
                      {explicit ? <>no</> : <>yes</>}
                    </div>
                    {episitu ? <>ON</> : <>OFF</>}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div id='single_edit_parts'>
                <div id='single_edit_parts_l'>
                  <div className='edit_parts'>Title</div>
                  <div className='edit_parts'>Description</div>
                  <div className='edit_parts'>Audio File</div>
                  <div className='edit_parts'>Image File</div>
                  <div className='edit_parts'>Explicit</div>
                  <div className='edit_parts'>Episode Number</div>
                  <div></div>
                  <div></div>
                  <div className='edit_parts'>Episode Status</div>
                  <div className='edit_parts'>Delete Episode</div>
                </div>
                <div id='single_edit_parts_r'>
                  <TextField id='newepi_title' label='Title'></TextField>
                  <TextField id='newepi_des' label='Description'></TextField>
                  <div className='image_btn_container'>
                    <div>
                      <img
                        src={require('../../../global/microphone.png')}
                        alt='audiofile'
                        id='audiofile_btn'
                        onClick={goaudiofile}
                        className='upimg'
                      ></img>
                    </div>
                    <div id='uploadPercent1'>{audiofile}</div>
                  </div>
                  <input
                    type='file'
                    id='newepi_file'
                    accept='audio/*'
                    onChange={getduration}
                    Style='display:none'
                  ></input>
                  <div className='image_btn_container'>
                    <div>
                      <img
                        src={require('../../../global/photo.png')}
                        alt='imagefile'
                        id='imagefile_btn'
                        onClick={goimagefile}
                        className='upimg'
                      ></img>
                    </div>
                    <div id='uploadPercent2'>{imgfile}</div>
                  </div>
                  <input
                    type='file'
                    id='newepi_image'
                    accept='image/*'
                    Style='display:none'
                    onChange={nowimagename}
                  ></input>
                  <select id='newepi_explicit'>
                    <option disabled selected>
                      explicit status
                    </option>
                    <option value='0'>no</option>
                    <option value='1'>yes</option>
                  </select>
                  <div></div>
                  <input
                    type='number'
                    min='1'
                    step='1'
                    id='newepi_episode'
                  ></input>
                  <div>
                    <Button onClick={goupdateepi} id='single_update_btn'>
                      update episode
                    </Button>
                  </div>
                  {episitu ? (
                    <Button onClick={goswitch} id='single_status_on'>
                      ON
                    </Button>
                  ) : (
                    <Button onClick={goswitch} id='single_status_off'>
                      OFF
                    </Button>
                  )}
                  <div>
                    <Button onClick={goremove} id='single_epi_remove'>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )
        ) : (
          <>
            <div>Episode Already removed.</div>
          </>
        )}
      </div>
    </Card>
  );
};
export default Episingle;
