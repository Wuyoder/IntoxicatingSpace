import { useEffect, useState } from 'react';
import { UPDATE_USER, USER_PROFILE, S3 } from '../../../global/constants';
import { Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Step from '../../step/steps';
import ajax from '../../../util/ajax';

const Updateuser = () => {
  const MySwal = withReactContent(Swal);
  const [setUserprofile] = useState({});
  const [username, setUsername] = useState([]);
  const [useremail, setUseremail] = useState([]);
  const [setImgurl] = useState('');
  const [image, setImage] = useState([]);
  useEffect(() => {
    const getuserprofile = async () => {
      const res = await ajax('get', USER_PROFILE);
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
    const res = await ajax('putdb', UPDATE_USER, {
      name: new_name,
      email: new_email,
      pwd: new_pwd,
    });
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
      const res = await ajax('post', S3, { type: 'profile_image' });
      if (res.data.presignedURL) {
        const s3res = await ajax('puts3', res.data.presignedURL, file);

        localStorage.setItem('user_image', res.data.presignedURL.split('?')[0]);
        setImgurl(res.data.presignedURL.split('?')[0]);
        if (s3res.status === 200) {
          await ajax('putdb', UPDATE_USER, {
            newprofileimage: res.data.presignedURL.split('?')[0],
          });
        }
      }
      window.location.reload();
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
      <Step.StepEditUserprofile />
      <div className='profile_title'>User Profile Update</div>
      <div className='updateuser_container'>
        <div>
          <div className='profile_image_container'>
            <div
              id='update_userprofile_image'
              style={{
                background: `url(${localStorage.getItem(
                  'user_image'
                )}) 50% 0 no-repeat `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
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
