import fetch from 'dva/fetch';
import { notification } from 'antd';
import qs from 'querystring';

const codeMessage = {
  200: '请求成功',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台队列',
  204: '删除数据成功',
  400: '请求失败',
  401: 'token失效',
  403: '禁止访问',
  404: '请求失败',
  406: '请求方式错误',
  500: '服务器错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
};
 
// 检查ajax返回的状态
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
 
  /**
   * 暂时没用，服务端返回的 status 始终为200
   *
   * @type {*|string|string}
   */
  const errorText = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errorText,
  });
 
  const error = new Error(response.statusText);
  error.name = response.status;
  error.response = response;
  throw error;
}
 
// fetch超时处理
const TIMEOUT = 100000;
const timeoutFetch = (url, options) => {
  let fetchPromise = fetch(url, options);
  let timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('请求超时')), TIMEOUT);
  });
  return Promise.race([fetchPromise, timeoutPromise]);
};
 
/**
 * 请求url，返回promise 对象
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
    method: 'POST',
    mode: 'cors',
  };
  const mergeOptions = {
    ...defaultOptions,
    ...options
  };
  const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
  const appKey = window.sessionStorage.getItem('appKey');
 
  mergeOptions.headers = {
    accept: 'application/json',
    'content-type': 'application/json; charset=utf-8',
    ...mergeOptions.headers,
  };
  if (appKey) mergeOptions.headers.uuuappkey = appKey;
  if (userInfo) mergeOptions.headers.uuutoken = userInfo.sessionId;
 
  if (mergeOptions.method !== 'GET') {
    mergeOptions.body = JSON.stringify(mergeOptions.body);
  }
 
  if (mergeOptions.method !== 'POST' && mergeOptions.params) {
    url = `${url}${url.indexOf('?') !== -1 ? '&' : '?'}${qs.stringify(mergeOptions.params)}`;
  }
 
  if (!mergeOptions.hideTime && !mergeOptions.params) {
    /* url = `${url}?timeStamp=${new Date().getTime()}`; */
    url = `${url}`
  }
 
  return timeoutFetch(url, mergeOptions)
    .then(checkStatus)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.code === 200 || data.success === true) {
        return data;
      }
      if (data.code === 300) { // 接口出错
        return data;
      }
      if (data.code === 401) { // token失效
        notification.error({
          message: 'token失效',
          description: data.msg,
          key: 'error'
        });
        window.g_app._store.dispatch({
          type: 'app/logout'
        });
        return data;
      }
      if (data.code === 403) { // 没有权限
        notification.error({
          message: '没有权限',
          description: data.msg,
          key: 'error'
        });
        return data;
      }
      if (data.code >= 404 && data.code < 422) {
        notification.error({
          message: '请求失败',
          description: data.msg,
          key: 'error'
        });
        return data;
      }
      if (data.code <= 504 && data.code >= 500) {
        notification.error({
          message: '服务器错误',
          description: data.msg,
          key: 'error'
        });
        return data;
      }
    })
    .catch((error) => {
      const {
        response
      } = error;
 
      let msg;
      let statusCode;
      if (response && response instanceof Object) {
        const {
          status,
          statusText
        } = response;
        statusCode = status;
        msg = statusText;
      } else {
        statusCode = 600;
        msg = 'Network Error';
      }
 
      return Promise.reject({
        success: false,
        code: statusCode,
        msg
      });
    });
}