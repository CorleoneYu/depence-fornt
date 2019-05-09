import axios from 'axios';
import { ERR_OK, DOMAIN } from 'common/const';

const request = async (params) => {
  try {
    let resp = await axios({
      url: `${DOMAIN}${params.url}`,
      method: params.method || 'GET',
      header: params.header || {
        'Content-Type': 'application/json'
      },
      data: { ...params.data}  });

    if (resp.data.status === ERR_OK) {
      return resp.data.data;
    } else {
      throw new Error(resp.data.data);
    }

  } catch(err) {
    console.log("catch-------------->", err);
    //throw new Error(err); 
    return Promise.reject(err);
  }
}

export default request;