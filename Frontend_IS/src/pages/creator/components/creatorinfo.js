import { useEffect, useState } from 'react';
import axios from 'axios';
import { CREATOR_PROFILE, SWITCHER, MYPAGE } from '../../../global/constants';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
const Creatorinfo = () => {
  const [cprofile, setCprofile] = useState([]);
  const [showstatus, setShowstatus] = useState(false);
  const [rssid, setRssid] = useState('');
  useEffect(() => {
    const getcreatorinfo = async () => {
      const res = await axios.get(CREATOR_PROFILE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCprofile(res.data[0]);
      console.log('showstatus', res.data[0].show_status);
      if (res.data[0].show_status === 1) {
        setShowstatus(true);
      } else {
        setShowstatus(false);
      }

      const rss = await axios.get(MYPAGE, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRssid(rss.data.rss_id);
    };
    getcreatorinfo();
  }, []);

  const goshowswitch = async () => {
    const res = await axios.post(
      SWITCHER,
      {
        type: 'show',
        show_id: cprofile.show_id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    setShowstatus(!showstatus);
  };

  return (
    <div className='cp_container'>
      <div>
        <img
          id='show_image'
          alt='show_image'
          src={localStorage.getItem('creator_image')}
        ></img>
      </div>
      <div id='cp_r'>
        <div id='cp_r_l'>
          <div className='origin_cp_info'>Creator Name </div>
          <div className='origin_cp_info'>Creator E-mail </div>
          <div className='origin_cp_info'>Podcast Name </div>
          <div className='origin_cp_info'>Podcast Description </div>
          <div className='origin_cp_info'>Podcast Category</div>
          <div className='origin_cp_info'>RSS Feed's URL</div>
          <div className='origin_cp_info'>Last Update</div>
          <div className='origin_cp_info'>Subscriber</div>
          <div className='origin_cp_info'>Status</div>
          <div className='origin_cp_info'>Myshow Page</div>
        </div>
        <div id='cp_r_r'>
          <div>{cprofile.creator_name}</div>
          <div>{cprofile.creator_email}</div>
          <div>{cprofile.show_name}</div>
          <div>{cprofile.show_des}</div>
          <div>
            {cprofile.show_category_main}-{cprofile.show_category_sub}
          </div>
          <div>
            <input
              id='rssfeed'
              value={
                'https://intoxicating.space/api/1.0/user/rss/' +
                cprofile.show_id
              }
              unselectable='on'
              onClick={() => {
                navigator.clipboard.writeText(
                  'https://intoxicating.space/api/1.0/user/rss/' +
                    cprofile.show_id
                );
                alert("RSS Feed's URL copied!");
              }}
            ></input>
          </div>
          <div>{cprofile?.show_time_update?.split('T')[0]}</div>
          <div>{cprofile.show_subscriber}</div>
          <div>
            {showstatus ? (
              <Button onClick={goshowswitch} id='show_status_on'>
                ON
              </Button>
            ) : (
              <Button onClick={goshowswitch} id='show_status_off'>
                OFF
              </Button>
            )}
          </div>
          <div>
            <Link to={`/showchoice/${rssid}`} id='linktomypage'>
              <Button id='gomypage'>MY PAGE PAGE</Button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div>
          <QRCodeCanvas
            value={`http://intoxicating.space/showchoice/${rssid}`}
            id='QRcode'
          />
        </div>
        <div>
          <Button
            onClick={() => {
              console.log(document.getElementById('QRcode'));
              html2canvas(document.getElementById('QRcode')).then((canvas) =>
                canvas.toBlob((blob) =>
                  navigator.clipboard.write([
                    new window.ClipboardItem({ 'image/png': blob }),
                  ])
                )
              );
              alert(`Podcast "${cprofile.show_name}" QRcode copied!`);
            }}
            id='copyQRcode'
          >
            QRcode
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Creatorinfo;
