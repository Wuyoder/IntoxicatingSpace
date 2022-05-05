import axios from 'axios';
import { useEffect, useState } from 'react';
import { UPDATE_USER, USER_PROFILE, S3 } from '../../../global/constants';
import Image from './image';
import { Button, Card, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const Updateuser = () => {
  const MySwal = withReactContent(Swal);
  const [userprofile, setUserprofile] = useState({});
  const [username, setUsername] = useState([]);
  const [useremail, setUseremail] = useState([]);
  const [imgurl, setImgurl] = useState('');
  const [image, setImage] = useState([]);
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
      MySwal.fire({
        icon: 'success',
        title: <h4 id='alert'>User Info Changed.</h4>,
      });
    } else {
      MySwal.fire({
        icon: 'error',
        title: <h4 id='alert'>{res.data.error}</h4>,
      });
    }
    document.getElementById('new_name').value = '';
    document.getElementById('new_email').value = '';
    document.getElementById('new_pwd').value = '';
  };

  const goupdateimage = async (e) => {
    e.preventDefault();
    const imageInput = document.querySelector('#imageInput');
    const file = imageInput.files[0];
    if (!file) {
      MySwal.fire({
        icon: 'error',
        title: <h4 id='alert'>Please Choose New Image First.</h4>,
      });
      return;
    }
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
                'waitpercent'
              ).innerHTML = `${percentCompleted}%`;
            } else {
              document.getElementById('waitpercent').innerHTML = 'completed!';
            }
          },
        });

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
      MySwal.fire({
        icon: 'error',
        title: <h4 id='alert'>Please Choose New Image First.</h4>,
      });
    }
    document.getElementById('update_userprofile_image').src =
      localStorage.getItem('user_image');
    MySwal.fire({
      icon: 'success',
      title: <h4 id='alert'>User Image Changed.</h4>,
    });
  };
  const nowimage = () => {
    if (document.getElementById('imageInput').files[0]) {
      setImage(document.getElementById('imageInput').files[0].name);
    } else {
      setImage('');
    }
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
                  onChange={nowimage}
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
                    id='upuser_image'
                  />
                </div>
                <div>
                  <Button onClick={goupdateimage} id='update_userprofile_btn1'>
                    Upload image
                  </Button>
                </div>
              </div>
              <div id='userimage'>{image}</div>
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
