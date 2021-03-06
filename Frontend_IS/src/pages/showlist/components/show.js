import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import React from 'react';
import { USER_HISTORY } from '../../../global/constants';
import ajax from '../../../util/ajax';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
} from '@mui/material';

const HotShow = ({ item }) => {
  const goclickshow = async (event) => {
    const res = await ajax('post', USER_HISTORY, {
      type: 'show',
      show: item.rss_id,
    });
  };

  return (
    <Link
      to={{
        pathname: `/showchoice/${item.rss_id}`,
        lable: `${item.rss_id}`,
      }}
      onClick={goclickshow}
      className='show_item'
    >
      <Card
        variant='outlined'
        key={`show-${item.rss_id}`}
        className='card_container'
      >
        <CardActionArea>
          <CardMedia
            component='img'
            height='140'
            image={item.rss_image}
            alt={item.title}
            className='card_image'
          ></CardMedia>
          <CardContent id='card_content'>
            <Typography variant='body1' color='text.primary'>
              {item.rss_title}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              Style='display:none'
            >
              ({item.rss_category_main})
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};
const Show = { HotShow };
export default Show;
