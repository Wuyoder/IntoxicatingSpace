import axios from 'axios';
import { useEffect, useState } from 'react';
import { UPDATE_USER, USER_PROFILE, S3 } from '../../../global/constants';
const Updateuser = () => {
  const [userprofile, setUserprofile] = useState({});
  const [username, setUsername] = useState([]);
  const [useremail, setUseremail] = useState([]);
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
    const res = await axios.post(
      S3,
      { type: 'profile_image' },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    if (res.data.presignedURL) {
      const s3res = await fetch(res.data.presignedURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: file,
      });
      localStorage.setItem('user_image', res.data.presignedURL.split('?')[0]);
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
        document.getElementById('user_image').src =
          localStorage.getItem('newimage');
      }
    }
  };

  return (
    <div>
      <h3>Updateuser</h3>
      <p>user name</p>
      <p>origin name: {username}</p>
      <input id='new_name' Style='background-color:black'></input>
      <p>user email</p>
      <p>origin email: {useremail}</p>
      <input id='new_email' Style='background-color:black'></input>
      <p>user password</p>
      <input
        id='new_pwd'
        Style='background-color:black'
        type='password'
      ></input>
      <p>user image</p>
      <div>
        <button
          value='update'
          Style='background-color:black'
          onClick={goupdate}
        >
          Update info
        </button>
        <div>
          <img
            id='user_image'
            alt='user_image'
            src={localStorage.getItem('user_image')}
          ></img>
          <div>
            <form id='imageForm'>
              <input id='imageInput' type='file' accept='image/*' />
              <button
                type='submit'
                Style='background-color:black'
                onClick={goupdateimage}
              >
                Upload image
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Updateuser;
