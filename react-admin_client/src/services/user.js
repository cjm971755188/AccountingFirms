import request from '../utils/request';

export function userLogin(params) { return request('/user/login', { method: 'POST', body: { ...params } }) }