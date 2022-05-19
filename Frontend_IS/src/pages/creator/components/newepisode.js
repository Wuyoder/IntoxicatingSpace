import { useState } from 'react';
import { EPISODE, S3 } from '../../../global/constants';
import { Button, Card } from '@mui/material';
import Step from '../../step/steps';
import ajax from '../../../util/ajax';
import salert from '../../../util/salert';
const Newepisode = ({ creatorprofile }) => {
  const [duration, setDuration] = useState(0);
  const [image, setImage] = useState([]);
  const [file, setFile] = useState([]);

  const getduration = () => {
    if (document.getElementById('episode_file').files[0]) {
      setFile(document.getElementById('episode_file').files[0].name);
    } else {
      setFile('');
    }
    let epifile = document.getElementById('episode_file');
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      setDuration(Math.round(video.duration));
    };
    video.src = URL.createObjectURL(epifile.files[0]);
  };

  const gonewepi = async (e) => {
    e.preventDefault();
    if (document.getElementById('episode_image').files[0].size > 9000000) {
      salert(
        'error',
        <h4 id='alert'>Please choose valid podcast artwork file.</h4>
      );

      return;
    }

    let epititle = document.getElementById('create_newepi_title');
    let epides = document.getElementById('episode_des');
    let epiexplicit = document.getElementById('episode_explicit');
    let epiimage = document.getElementById('episode_image');
    let epifile = document.getElementById('episode_file');
    let epinum = document.getElementById('episode_num');
    if (
      epititle.value === '' ||
      epides.value === '' ||
      epiexplicit.value === '' ||
      epinum.value === ''
    ) {
      salert('error', <h4 id='alert'>Episode Info should be completed.</h4>);
    } else {
      if (!epiimage.files[0]) {
        salert('error', <h4 id='alert'>Please Choose Episode's Image.</h4>);
      } else {
        if (!epifile.files[0]) {
          salert(
            'error',
            <h4 id='alert'>Please Choose Episode's Audio file.</h4>
          );
        } else {
          salert('upload');
          const res1 = await ajax('post', S3, {
            type: 'episode_image',
            episode_num: epinum.value,
          });
          const s3res1 = await ajax(
            'puts3',
            res1.data.presignedURL,
            epiimage.files[0]
          );
          ///for file
          const res2 = await ajax('post', S3, {
            type: 'episode_file',
            episode_num: epinum.value,
          });

          const s3res2 = await ajax(
            'puts3',
            res2.data.presignedURL,
            epifile.files[0]
          );

          const imageurl = res1.data.presignedURL.split('?')[0];
          const fileurl = res2.data.presignedURL.split('?')[0];

          const newepi = await ajax('post', EPISODE, {
            show_id: creatorprofile.show_id,
            title: epititle.value,
            des: epides.value,
            file: fileurl,
            duration: duration,
            length: epifile.files[0].size,
            explicit: epiexplicit.value,
            image: imageurl,
            episode: epinum.value,
          }).then((response) => {
            console.log('response', response);
            console.log(response.data.error);
            if (!response.data.error) {
              salert('success', <h4 id='alert'>New Episode Published.</h4>);
            } else {
              salert('error', <h4 id='alert'>{response.data.error}</h4>);
            }
          });

          document.getElementById('create_newepi_title').value = '';
          document.getElementById('episode_des').value = '';
          document.getElementById('episode_num').value = '';
        }
      }
    }
  };
  const nowimage = () => {
    if (document.getElementById('episode_image').files[0]) {
      if (document.getElementById('episode_image').files[0].size > 9000000) {
        salert(
          'error',
          <>
            <h4 id='alert'>Image File too large</h4>
            <h6>
              Podcast artwork must be between 1400 x 1400 and 3000 x 3000
              pixels, JPG or PNG.
            </h6>
          </>
        );
      }
      setImage(document.getElementById('episode_image').files[0].name);
    } else {
      setImage('');
    }
  };

  return (
    <>
      <Step.StepNewEpi />
      <Card variant='outlined' id='newepi_card'>
        <h3 className='profile_title'>New Episode</h3>
        <div className='newepi-container'>
          <div>
            <form id='newepi_form'>
              <div className='single_epi_title'>Episode Title</div>
              <input label='Episode Title' id='create_newepi_title'></input>
              <div className='single_epi_title'>Episode Description</div>
              <textarea
                id='episode_des'
                Style='background-color:black;resize:none'
              ></textarea>
              <div className='single_epi_title'>Episode Number</div>
              <input type='number' min='1' step='1' id='episode_num'></input>
              <div className='single_epi_title'>explicit </div>
              <select id='episode_explicit'>
                <option value='0'>no</option>
                <option value='1'>yes</option>
              </select>
              <div id='image_btn_container1'>
                <div className='single_epi_title'>Image File</div>

                <div>
                  <img
                    onClick={() => {
                      document.getElementById('episode_image').click();
                    }}
                    src={require('../../../global/photo.png')}
                    alt='upload'
                    className='upimg'
                    id='photo_btn'
                  />
                </div>
              </div>

              <input
                id='episode_image'
                type='file'
                accept='image/*'
                Style='display:none'
                required
                onChange={nowimage}
              ></input>
              <div id='image_btn_container2'>
                <div className='single_epi_title'>Audio File</div>
                <div>
                  <img
                    onClick={() => {
                      document.getElementById('episode_file').click();
                    }}
                    src={require('../../../global/microphone.png')}
                    alt='upload'
                    className='upimg'
                    id='microphone_btn'
                  />
                </div>
              </div>
              <input
                id='episode_file'
                type='file'
                accept='audio/*'
                required
                Style='display:none'
                onChange={getduration}
              ></input>
              <div id='nowimage'>{image}</div>
              <div id='nowfile'>{file}</div>
              <div>
                <Button
                  type='submit'
                  onClick={gonewepi}
                  className='btn_type'
                  id='newepi_btn'
                >
                  upload new episode!
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </>
  );
};
export default Newepisode;
