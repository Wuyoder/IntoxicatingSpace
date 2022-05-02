import axios from 'axios';
import { useEffect, useState } from 'react';
import { UPDATE_USER, USER_PROFILE, S3 } from '../../../global/constants';
import Image from './image';
import { Button, Card, TextField } from '@mui/material';
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
    <>
      <div className='profile_title'>User Profile Update</div>
      <div className='updateuser_container'>
        <div>
          <div className='profile_image_container'>
            <Image imgurl={imgurl} />
          </div>
          <div>
            <form>
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
                  <Button onClick={goupdateimage} id='update_userprofile_btn1'>
                    Upload image
                  </Button>
                </div>
              </div>
              <div id='uploadPercent'>
                <div id='pre_upload'>upload progress...</div>
              </div>
            </div>
          </div>
        </div>
        <div id='updateuser_r'>
          <div>
            <div className='origin_info'>origin username : " {username} "</div>
            <TextField label='New Username' id='new_name'></TextField>
          </div>
          <div>
            <div className='origin_info'>origin E-mail : " {useremail} "</div>
            <TextField label='New E-mail' id='new_email'></TextField>
          </div>
          <div>
            <div className='origin_info'>new password</div>
            <TextField
              type='password'
              label='New Password'
              id='new_pwd'
            ></TextField>
          </div>
          <div>
            <Button onClick={goupdate} id='update_userprofile_btn2'>
              Update User Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Updateuser;
