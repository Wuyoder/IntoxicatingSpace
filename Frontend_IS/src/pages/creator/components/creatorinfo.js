import { useEffect, useState } from 'react';
import { CREATOR_PROFILE, SWITCHER, MYPAGE } from '../../../global/constants';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Step from '../../step/steps';
import ajax from '../../../util/ajax';

const Creatorinfo = () => {
  const MySwal = withReactContent(Swal);
  const [cprofile, setCprofile] = useState([]);
  const [showstatus, setShowstatus] = useState(false);
  const [rssid, setRssid] = useState('');
  useEffect(() => {
    const getcreatorinfo = async () => {
      const res = await ajax('get', CREATOR_PROFILE);
      setCprofile(res.data[0]);
      if (res.data[0].show_status === 1) {
        setShowstatus(true);
      } else {
        setShowstatus(false);
      }
      const rss = await ajax('get', MYPAGE);
      setRssid(rss.data.rss_id);
    };
    getcreatorinfo();
  }, []);

  const goshowswitch = async () => {
    await ajax('post', SWITCHER, {
      type: 'show',
      show_id: cprofile.show_id,
    });

    setShowstatus(!showstatus);
    MySwal.fire({
      icon: 'info',
      title: (
        <h4 id='alert'>
          Your Show Status Switch to :
          {(() => {
            if (showstatus) {
              return ' OFF';
            } else {
              return ' ON';
            }
          })()}
        </h4>
      ),
    });
  };

  return (
    <>
      <Step.StepCreator />
      <div className='cp_container' id='cp_container'>
        <div>
          <div
            id='show_image'
            style={{
              background: `url(${localStorage.getItem(
                'creator_image'
              )}) 50% 0 no-repeat `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
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
            <div
              onClick={() => {
                navigator.clipboard.writeText(
                  'https://api.intoxicating.space/api/1.0/user/rss/' +
                    cprofile.show_id
                );
                MySwal.fire({
                  icon: 'success',
                  title: <h4 id='alert'>RSS Feed's URL copied!</h4>,
                });
              }}
            >
              <input
                id='rssfeed'
                value={
                  'https://api.intoxicating.space/api/1.0/user/rss/' +
                  cprofile.show_id
                }
                unselectable='on'
              ></input>
            </div>
            <div>{cprofile?.show_time_update?.split('T')[0]}</div>
            <div>{cprofile.show_subscriber}</div>
            <div id='show_status'>
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
            <div
              onClick={() => {
                MySwal.fire({
                  timer: 1500,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });
              }}
            >
              <Link to={`/showchoice/${rssid}`} id='linktomypage'>
                <Button id='gomypage'>MY PAGE PAGE</Button>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div>
            <QRCodeCanvas
              value={`https://intoxicating.space/showchoice/${rssid}`}
              id='QRcode'
            />
          </div>
          <div>
            <Button
              onClick={() => {
                html2canvas(document.getElementById('QRcode')).then((canvas) =>
                  canvas.toBlob((blob) =>
                    navigator.clipboard.write([
                      new window.ClipboardItem({ 'image/png': blob }),
                    ])
                  )
                );
                MySwal.fire({
                  icon: 'success',
                  title: (
                    <>
                      <h4 className='alert'>
                        Podcast "{cprofile.show_name}" QRcode copied!
                      </h4>
                    </>
                  ),
                });
              }}
              id='copyQRcode'
            >
              QRcode
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Creatorinfo;
