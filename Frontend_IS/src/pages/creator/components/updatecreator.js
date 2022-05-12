import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  UPDATE_USER,
  USER_PROFILE,
  S3,
  CREATOR_PROFILE,
} from '../../../global/constants';
import { UPDATE_CREATOR } from '../../../global/constants';
import { Button, Card, MenuItem, Select, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Step from '../../step/steps';
const Updatecreator = ({ creatorprofile }) => {
  const MySwal = withReactContent(Swal);
  const [cprofile, setCprofile] = useState([]);
  const [image, setImage] = useState([]);
  const [cname, setCname] = useState([]);
  const [cemail, setCemail] = useState([]);
  const [sname, setSname] = useState([]);
  const [sdes, setSdes] = useState([]);
  const [smain, setSmain] = useState([]);
  const [ssub, setSsub] = useState([]);

  useEffect(() => {
    const getcreatorinfo = async () => {
      const res = await axios.get(CREATOR_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCprofile(res.data[0]);
      console.log(cprofile);
      setCname(res.data[0].creator_name);
      setCemail(res.data[0].creator_email);
      setSname(res.data[0].show_name);
      setSdes(res.data[0].show_des);
      setSmain(res.data[0].show_category_main);
      setSsub(res.data[0].show_category_sub);
    };
    getcreatorinfo();
  }, []);

  const goupdate = async () => {
    let new_creator_name = document.getElementById('new_creator_name').value;
    let new_creator_email = document.getElementById('new_creator_email').value;
    let new_show_name = document.getElementById('new_show_name').value;
    let new_show_category = document.getElementById('new_show_category').value;
    let new_show_des = document.getElementById('new_show_des').value;
    const res = await axios.put(
      UPDATE_CREATOR,
      {
        cname: new_creator_name,
        cmail: new_creator_email,
        sname: new_show_name,
        scategory: new_show_category,
        sdes: new_show_des,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );

    if (res.data.error) {
      MySwal.fire({
        icon: 'error',
        title: <h4 id='alert'>{res.data.error}</h4>,
      });
      return;
    } else {
      MySwal.fire({
        icon: 'success',
        title: <h4 id='alert'>Creator Info Changed.</h4>,
      });
    }
    //TODO:要把res.data列出來
    console.log('newprofile', res.data);

    setCname(res.data.creator_name);
    setCemail(res.data.creator_email);
    setSname(res.data.show_name);
    setSdes(res.data.show_des);
    setSmain(res.data.show_category_main);
    setSsub(res.data.show_category_sub);

    document.getElementById('new_creator_name').value = '';
    document.getElementById('new_creator_email').value = '';
    document.getElementById('new_show_name').value = '';
    document.getElementById('new_show_category').value = '';
    document.getElementById('new_show_des').value = '';
  };

  const goupdateimage = async (e) => {
    e.preventDefault();
    const imageInput = document.getElementById('new_show_image');
    const file = imageInput.files[0];
    if (!file) {
      MySwal.fire({
        icon: 'error',
        title: <h4 id='alert'>Nothing Changed.</h4>,
      });
      return;
    }
    if (document.getElementById('new_show_image').files[0].size > 9000000) {
      MySwal.fire({
        icon: 'error',
        title: <h4 id='alert'>Please choose valid podcast artwork file.</h4>,
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
      localStorage.setItem(
        'creator_image',
        res.data.presignedURL.split('?')[0]
      );
      if (s3res.status === 200) {
        const update = await axios.put(
          UPDATE_CREATOR,
          {
            newshowimage: res.data.presignedURL.split('?')[0],
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (update.data.status) {
          localStorage.setItem(
            'creator_image',
            res.data.presignedURL.split('?')[0]
          );
          document.getElementById('show_image').src =
            localStorage.getItem('creator_image');
          MySwal.fire({
            icon: 'success',
            title: <h4 id='alert'>{update.data.status}</h4>,
          });
        }
      }
    }
  };
  const nowimage = () => {
    if (document.getElementById('new_show_image').files[0]) {
      if (document.getElementById('new_show_image').files[0].size > 9000000) {
        MySwal.fire({
          icon: 'error',
          title: (
            <>
              <h4 id='alert'>Image File too large</h4>
              <h6>
                Podcast artwork must be between 1400 x 1400 and 3000 x 3000
                pixels, JPG or PNG.
              </h6>
            </>
          ),
        });
      }
      setImage(document.getElementById('new_show_image').files[0].name);
    } else {
      setImage('');
    }
  };

  return (
    <>
      <Step.StepEditCreator />
      <div id='cp_all_container'>
        <div className='profile_title' id='update_creator_info'>
          Creator Info Update
        </div>
        <div className='update_creator_container'>
          <div>
            <div>
              <img
                id='show_image'
                alt='show_iamge'
                src={localStorage.getItem('creator_image')}
                Style='height: 150px'
              ></img>
            </div>
            <form>
              <img
                onClick={() => {
                  document.getElementById('new_show_image').click();
                }}
                src={require('../../../global/photo.png')}
                alt='upload'
                className='upimg'
                id='cp_upload_image'
              />
              <input
                Style='display:none'
                id='new_show_image'
                type='file'
                accept='image/*'
                onChange={nowimage}
              ></input>
              <div>
                <Button
                  type='submit'
                  onClick={goupdateimage}
                  className='btn_type'
                  id='newshowimage'
                >
                  Podcast image
                </Button>
              </div>
              <div></div>
              <div id='showimage'>{image}</div>
            </form>
          </div>
          <div id='upcp_r'>
            <p className='new_creator_type'>
              origin creator name : " {cname} "
            </p>
            <TextField
              className='input_type'
              id='new_creator_name'
              label='New Creator Name'
            ></TextField>
            <p className='new_creator_type'>
              origin creator email : " {cemail} "
            </p>
            <TextField
              className='input_type'
              id='new_creator_email'
              label='New Creator E-mail'
            ></TextField>
            <p className='new_creator_type'>
              origin Podcast name : " {sname} "
            </p>
            <TextField
              className='input_type'
              id='new_show_name'
              label='New Podcast Name'
            ></TextField>
            <p className='new_creator_type'>
              origin show description : " {sdes} "
            </p>
            <TextField
              className='input_type'
              id='new_show_des'
              label='New Podcast Description'
            ></TextField>
            <p className='new_creator_type'>
              origin show category : " {smain} - {ssub} "
            </p>
            <select id='new_show_category' Style='background-color:#222a32'>
              <optgroup>
                <option disabled selected>
                  choose new category
                </option>
              </optgroup>
              <optgroup label='Arts'>
                <option value='Arts_Books'>Books</option>
                <option value='Arts_Design'>Design</option>
                <option value='Arts_Fashion &amp; Beauty'>
                  Fashion &amp; Beauty
                </option>
                <option value='Arts_Food'>Food</option>
                <option value='Arts_Performing Arts'>Performing Arts</option>
                <option value='Arts_Visual Arts'>Visual Arts</option>
              </optgroup>
              <optgroup label='Business'>
                <option value='Business_Careers'>Careers</option>
                <option value='Business_Entrepreneurship'>
                  Entrepreneurship
                </option>
                <option value='Business_Investing'>Investing</option>
                <option value='Business_Management'>Management</option>
                <option value='Business_Marketing'>Marketing</option>
                <option value='Business_Non-Profit'>Non-Profit</option>
              </optgroup>
              <optgroup label='Comedy'>
                <option value='Comedy_Comedy Interviews'>
                  Comedy Interviews
                </option>
                <option value='Comedy_Improv'>Improv</option>
                <option value='Comedy_Stand-Up' option>
                  Stand-Up
                </option>
              </optgroup>
              <optgroup label='Education'>
                <option value='Education_Courses'>Courses</option>
                <option value='Education_How To'>How To</option>
                <option value='Education_Language Learning'>
                  Language Learning
                </option>
                <option value='Education_Self-Improvement'>
                  Self-Improvement
                </option>
              </optgroup>
              <optgroup label='Fiction'>
                <option value='Fiction_Comedy Fiction'>Comedy Fiction</option>
                <option value='Fiction_Drama'>Drama</option>
                <option value='Fiction_Science Fiction'>Science Fiction</option>
              </optgroup>
              <optgroup label='Government'>
                <option value='Government_Government'>Government</option>
              </optgroup>
              <optgroup label='History'>
                <option value='History_History'>History</option>
              </optgroup>
              <optgroup label='Health &amp; Fitness'>
                <option value='Health &amp; Fitness_Alternative Health'>
                  Alternative Health
                </option>
                <option value='Health &amp; Fitness_Fitness'>Fitness</option>
                <option value='Health &amp; Fitness_Medicine'>Medicine</option>
                <option value='Health &amp; Fitness_Mental Health'>
                  Mental Health
                </option>
                <option value='Health &amp; Fitness_Nutrition'>
                  Nutrition
                </option>
                <option value='Health &amp; Fitness_Sexuality'>
                  Sexuality
                </option>
              </optgroup>
              <optgroup label='Kids &amp; Family'>
                <option value='Kids &amp; Family_Education for Kids'>
                  Education for Kids
                </option>
                <option value='Kids &amp; Family_Parenting'>Parenting</option>
                <option value='Kids &amp; Family_Pets &amp; Animals'>
                  Pets &amp; Animals
                </option>
                <option value='Kids &amp; Family_Stories for Kids'>
                  Stories for Kids
                </option>
              </optgroup>
              <optgroup label='Leisure'>
                <option value='Leisure_Animation &amp; Manga'>
                  Animation &amp; Manga
                </option>
                <option value='Leisure_Automotive'>Automotive</option>
                <option value='Leisure_Aviation'>Aviation</option>
                <option value='Leisure_Crafts'>Crafts</option>
                <option value='Leisure_Games'>Games</option>
                <option value='Leisure_Hobbies'>Hobbies</option>
                <option value='Leisure_Home &amp; Garden'>
                  Home &amp; Garden
                </option>
                <option value='Leisure_Video Games'>Video Games</option>
              </optgroup>
              <optgroup label='Music'>
                <option value='Music_Music Commentary'>Music Commentary</option>
                <option value='Music_Music History<'>Music History</option>
                <option value='Music_Music Interviews'>Music Interviews</option>
              </optgroup>
              <optgroup label='News'>
                <option value='News_Business News'>Business News</option>
                <option value='News_Daily News'>Daily News</option>
                <option value='News_Entertainment News'>
                  Entertainment News
                </option>
                <option value='News_News Commentary'>News Commentary</option>
                <option value='News_Politics'>Politics</option>
                <option value='News_Sports News'>Sports News</option>
                <option value='News_Tech News'>Tech News</option>
              </optgroup>
              <optgroup label='Religion &amp; Spiritually'>
                <option value='Religion &amp; Spiritually_Buddhism'>
                  Buddhism
                </option>
                <option value='Religion &amp; Spiritually_Christianity'>
                  Christianity
                </option>
                <option value='Religion &amp; Spiritually_Hinduism'>
                  Hinduism
                </option>
                <option value='Religion &amp; Spiritually_Islam'>Islam</option>
                <option value='Religion &amp; Spiritually_Judiasm'>
                  Judiasm
                </option>
                <option value='Religion &amp; Spiritually_Religion'>
                  Religion
                </option>
                <option value='Religion &amp; Spiritually_Spirituality'>
                  Spirituality
                </option>
              </optgroup>
              <optgroup label='Science'>
                <option value='Science_Astronomy'>Astronomy</option>
                <option value='Science_Chemistry'>Chemistry</option>
                <option value='Science_Earth Sciences'>Earth Sciences</option>
                <option value='Science_Life Sciences'>Life Sciences</option>
                <option value='Science_Mathematics'>Mathematics</option>
                <option value='Science_Natural Sciences'>
                  Natural Sciences
                </option>
                <option value='Science_Nature'>Nature</option>
                <option value='Science_Physics'>Physics</option>
                <option value='Science_Social Sciences'>Social Sciences</option>
              </optgroup>
              <optgroup label='Society &amp; Culture'>
                <option value='Society &amp; Culture_Documentary'>
                  Documentary
                </option>
                <option value='Society &amp; Culture_Personal Journals'>
                  Personal Journals
                </option>
                <option value='Society &amp; Culture_Philosophy'>
                  Philosophy
                </option>
                <option value='Society &amp; Culture_Places &amp; Travel'>
                  Places &amp; Travel
                </option>
                <option value='Society &amp; Culture_Relationships'>
                  Relationships
                </option>
              </optgroup>
              <optgroup label='Sports'>
                <option value='Sports_Baseball'>Baseball</option>
                <option value='Sports_Basketball'>Basketball</option>
                <option value='Sports_Cricket'>Cricket</option>
                <option value='Sports_Fantasy Sports'>Fantasy Sports</option>
                <option value='Sports_Football'>Football</option>
                <option value='Sports_Golf'>Golf</option>
                <option value='Sports_Hockey'>Hockey</option>
                <option value='Sports_Rugby'>Rugby</option>
                <option value='Sports_Soccer'>Soccer</option>
                <option value='Sports_Swimming'>Swimming</option>
                <option value='Sports_Tennis'>Tennis</option>
                <option value='Sports_Volleyball'>Volleyball</option>
                <option value='Sports_Wilderness'>Wilderness</option>
                <option value='Sports_Wrestling'>Wrestling</option>
              </optgroup>
            </select>
            <div className='textcenter'>
              <Button
                onClick={goupdate}
                className='btn_type'
                id='new_creator_info'
              >
                Upload Podcast info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Updatecreator;
