import request from '../utils/request';

export function getList(params) {
  return request(`/home/personnelManage/getList`, { method: 'POST', body: { ...params }, });
}

export function getDetail(params) {
  return request(`/home/personnelManage/getDetail`, { method: 'POST', body: { ...params }, });
}