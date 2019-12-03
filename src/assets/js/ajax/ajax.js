import Vue from 'vue';
import axios from 'axios';

import { getOrigin } from '../util.js';

const INIT_AXIOS_HEADERS = {
  'Pragma': 'no-cache', // ajax http get result is forced cached by IE, so use no-cache header
  'Cache-Control': 'no-cache'
};

/***
 * merge new header into original header, return result
 *
 * 注意：自定义设置header，需要先在后端设置Access-Control-Allow-Headers，不然会在预检请求报跨域
 */
function getMergedHttpHeaders(newHeader, originHeader = INIT_AXIOS_HEADERS) {
  let headers;
  try {
    headers = JSON.parse(JSON.stringify(originHeader));
  } catch (e) {
    console.error(e);
    headers = {};
  }
  if (newHeader) {
    Object.keys(newHeader).forEach((headerKey) => {
      headers[headerKey] = newHeader[headerKey];
    });
  }
  return headers;
}

/***
 * axios返回数据处理器
 * @param successHttpCode 判定为成功的http code
 * @param response axios response
 * @param successCb 成功的回调函数
 * @private
 */
function axiosRespHandler(successHttpCode, response, successCb) {
  if (response.status === successHttpCode) {
    if (successCb) {
      successCb(response.data);
    }
  } else {
    console.log(`Unsuccessful Http Code: ${response.status}.`);
  }
}

function Ajax() {
  this.get = function(url, successCb, errorCb, customHeaders) {
    let headers = getMergedHttpHeaders(customHeaders, INIT_AXIOS_HEADERS);
    axios({
      url: url,
      method: 'get',
      headers: headers
    })
      .then((response) => {
        axiosRespHandler(200, response, successCb);
      })
      .catch((error) => {
        if (errorCb) {
          errorCb(error);
        } else {
          console.log(error);
        }
      });
  };

  this.getLocalResource = function(filePath, successCb, errorCb) {
    let suffix = `?v=${Math.random()}`;
    let url = getOrigin() + filePath + suffix;
    this.get(url, successCb, errorCb);
  };
}

Vue.prototype.$ajax = new Ajax();
