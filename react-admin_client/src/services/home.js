import request from '../utils/request';

export function getMenus(params) {
  return request(`/home/getMenus`, { method: 'POST', body: { ...params }, });
}