import request from '../utils/request';

const apiPrefix = 'http://localhost:3001'

export function loginUser(params) {
  return request(`${apiPrefix}/login/loginUser`, {
    method: 'POST',
    body: { ...params },
  });
}