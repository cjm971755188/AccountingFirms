import request from '../utils/request';

export function getDepartmentList(params) { return request('/department/getDepartmentList', { method: 'POST', body: { ...params } }) }

export function createDepartment(params) { return request('/department/createDepartment', { method: 'POST', body: { ...params } }) }

export function editDepartment(params) { return request('/department/editDepartment', { method: 'POST', body: { ...params } }) }

export function deleteDepartment(params) { return request('/department/deleteDepartment', { method: 'POST', body: { ...params } }) }