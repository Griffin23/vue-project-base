import Vue from 'vue';
import qs from 'Qs';
import axios from 'axios';

import { getOrigin } from '../util.js';

const INIT_AXIOS_HEADERS = {
  'Pragma': 'no-cache', // ajax http get result is forced cached by IE, so use no-cache header
  'Cache-Control': 'no-cache'
};

const HEADER_CONTENT_TYPE = {
  json: 'application/json',
  formEncode: 'application/x-www-form-urlencoded'
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
    let headers = getMergedHttpHeaders(customHeaders);
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

  this.post = function(url, postParam, successCb, errorCb, customHeaders, contentType = HEADER_CONTENT_TYPE.json) {
    let headers = getMergedHttpHeaders(customHeaders);
    headers['Content-Type'] = contentType;
    // qs可以将数据序列化为以&拼接的形式
    let data = (contentType === HEADER_CONTENT_TYPE.formEncode) ? qs.stringify(postParam) : postParam;
    axios({
      url: url,
      method: 'post',
      data: data,
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
