import axios from 'axios';
import { useState, useEffect } from 'react';
import { EPISODE, S3 } from '../../../global/constants';

const Newepisode = ({ creatorprofile }) => {
  const [duration, setDuration] = useState(0);
  const getduration = () => {
    let epifile = document.getElementById('episode_file');
    console.log('into function');
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
    let epititle = document.getElementById('episode_title');
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
      alert('new episode info should be completed');
    } else {
      if (!epiimage.files[0]) {
        alert('please choose your new episode image');
      } else {
        if (!epifile.files[0]) {
          alert('please choose your new episode file');
        } else {
          //
          //for image
          const res1 = await axios.post(
            S3,
            { type: 'episode_image', episode_num: epinum.value },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          const s3res1 = await fetch(res1.data.presignedURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: epiimage.files[0],
          });

          ///for file
          const res2 = await axios.post(
            S3,
            { type: 'episode_file', episode_num: epinum.value },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          const s3res2 = await fetch(res2.data.presignedURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: epifile.files[0],
          });

          const imageurl = res1.data.presignedURL.split('?')[0];
          const fileurl = res2.data.presignedURL.split('?')[0];

          //先打S3上傳完，把key留下來，在upload DB

          const newepi = await axios.post(
            EPISODE,
            {
              show_id: creatorprofile.show_id,
              title: epititle.value,
              des: epides.value,
              file: fileurl,
              duration: duration,
              length: epifile.files[0].size,
              explicit: epiexplicit.value,
              image: imageurl,
              episode: epinum.value,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          if (!newepi.data.error) {
            alert('new episode already published');
          }
          document.getElementById('episode_title').value = '';
          document.getElementById('episode_des').value = '';
          document.getElementById('episode_num').value = '';

          console.log(newepi);
          window.location.replace('/creator');
        }
      }
    }
  };

  return (
    <div className='newepi-container'>
      <h3 className='profile_title'>New Episode</h3>
      <form id='newepi_form'>
        <div className='single_epi_title'>episode title</div>
        <input
          id='episode_title'
          className='input_type'
          Style='background-color:black'
        ></input>
        <div className='single_epi_title'>episode description</div>
        <textarea
          className='input_type'
          id='episode_des'
          Style='background-color:black;resize:none'
        ></textarea>
        <div className='single_epi_title'>episode number</div>
        <input
          type='number'
          min='1'
          step='1'
          className='input_type'
          id='episode_num'
          Style='background-color:black'
        ></input>
        <div className='single_epi_title'>episode explicit </div>
        <select id='episode_explicit' Style='background-color:black'>
          <option value='0'>no</option>
          <option value='1'>yes</option>
        </select>
        <div className='single_epi_title'>episode image :</div>
        <input
          className='input_type'
          id='episode_image'
          type='file'
          accept='image/*'
          required
        ></input>
        <div className='single_epi_title'>episode file</div>
        <input
          className='input_type'
          id='episode_file'
          type='file'
          accept='audio/*'
          required
          onChange={getduration}
        ></input>
        <div>
          <button
            type='submit'
            Style='background-color:black'
            onClick={gonewepi}
            className='btn_type'
            id='newepi_btn'
          >
            upload new episode!
          </button>
        </div>
      </form>
    </div>
  );
};
export default Newepisode;
