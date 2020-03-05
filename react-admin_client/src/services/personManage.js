import request from '../utils/request';

export function getList(params) {
  return request('/person/getList', { method: 'POST', body: { ...params } });
}