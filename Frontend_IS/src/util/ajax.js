import axios from 'axios';
const ajax = async (method, url, body, config) => {
  if (method === 'get') {
    const result = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return result;
  }
  if (method === 'post') {
    const result = await axios.post(url, body, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return result;
  }
  if (method === 'postMsg') {
    const result = await axios.post(url, body);
    return result;
  }
  if (method === 'putdb') {
    const result = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result;
  }
  if (method === 'puts3') {
    const result = await axios.put(url, body, {
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
    return result;
  }
  if (method === 'delete') {
    const result = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: body,
    });
    return result;
  }
};

export default ajax;
