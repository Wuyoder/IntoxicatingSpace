import axios from 'axios';
import { useEffect, useState } from 'react';
import { UPDATE_USER, USER_PROFILE, S3 } from '../../../global/constants';
import Image from './image';
const Updateuser = () => {
  const [userprofile, setUserprofile] = useState({});
  const [username, setUsername] = useState([]);
  const [useremail, setUseremail] = useState([]);
  const [imgurl, setImgurl] = useState('');
  useEffect(() => {
    const getuserprofile = async () => {
      const res = await axios.get(USER_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUserprofile(res.data);
      setUsername(res.data.name);
      setUseremail(res.data.email);
    };
    getuserprofile();
  }, []);

  const goupdate = async () => {
    let new_name = document.getElementById('new_name').value;
    let new_email = document.getElementById('new_email').value;
    let new_pwd = document.getElementById('new_pwd').value;
    const res = await axios.put(
      UPDATE_USER,
      {
        name: new_name,
        email: new_email,
        pwd: new_pwd,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUsername(res.data.user_name);
      setUseremail(res.data.user_email);
    } else {
      alert(res.data.error);
    }
    document.getElementById('new_name').value = '';
    document.getElementById('new_email').value = '';
    document.getElementById('new_pwd').value = '';
  };

  const goupdateimage = async (e) => {
    e.preventDefault();
    const imageInput = document.querySelector('#imageInput');
    const file = imageInput.files[0];
    console.log(imageInput.files[0]);

    if (imageInput.files[0]) {
      const res = await axios.post(
        S3,
        { type: 'profile_image' },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (res.data.presignedURL) {
        const s3res = await axios.put(res.data.presignedURL, file, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            var percentCompleted = Math.round((e.loaded * 100) / e.total);
            if (percentCompleted < 100) {
              document.getElementById(
                'uploadPercent'
              ).innerHTML = `${percentCompleted}%`;
            } else {
              document.getElementById('uploadPercent').innerHTML = 'completed!';
            }
            console.log(percentCompleted);
          },
        });
        console.log(s3res);

        localStorage.setItem('user_image', res.data.presignedURL.split('?')[0]);
        setImgurl(res.data.presignedURL.split('?')[0]);
        if (s3res.status === 200) {
          await axios.put(
            UPDATE_USER,
            {
              newprofileimage: res.data.presignedURL.split('?')[0],
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
        }
      }
    } else {
      alert('please choose new image first');
    }
    document.getElementById('user_image').src =
      localStorage.getItem('user_image');
  };

  return (
    <div className='updateuser_container'>
      <h3 className='profile_title'>User Profile Update</h3>
      <div>
        <div className='profile_image_container'>
          <Image imgurl={imgurl} />
        </div>
        <div>
          <form id='imageForm' Style='display:none'>
            <div className='textcenter'>
              <input
                id='imageInput'
                type='file'
                accept='image/*'
                Style='display:none'
              />
            </div>
          </form>
          <div className='textcenter'>
            <div className='upload_element'>
              <div>
                <img
                  onClick={() => {
                    document.getElementById('imageInput').click();
                  }}
                  src={require('../../../global/photo.png')}
                  alt='upload'
                  className='upimg'
                />
              </div>
              <div>
                <button
                  type='submit'
                  Style='background-color:black'
                  onClick={goupdateimage}
                  className='new_userimage_btn'
                >
                  Upload image
                </button>
              </div>
              <div id='uploadPercent'></div>
            </div>
          </div>
        </div>
      </div>

      <p className='oringin_item' id='origin_name_sub'>
        origin name : " {username} "
      </p>

      <input
        id='new_name'
        className='input_type'
        Style='background-color:black'
      ></input>

      <p className='oringin_item'>origin email: {useremail}</p>
      <input
        id='new_email'
        Style='background-color:black'
        className='input_type'
      ></input>
      <p className='oringin_item'>new password</p>
      <input
        id='new_pwd'
        Style='background-color:black'
        type='password'
        className='input_type'
      ></input>
      <div>
        <button
          value='update'
          Style='background-color:black'
          onClick={goupdate}
          className='btn_type'
        >
          Update info
        </button>
      </div>
    </div>
  );
};
export default Updateuser;
