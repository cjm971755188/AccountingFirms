import request from '../utils/request';

export function userLogin(params) {
  return request(`/user/userLogin`, { method: 'POST', body: { ...params }, });
}