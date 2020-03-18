import request from '../utils/request';

export function userLogin(params) { return request('/user/login', { method: 'POST', body: { ...params } }) }

export function getMenus(params) { return request(`/user/getMenus`, { method: 'POST', body: { ...params } }) }

export function getPermissions(params) { return request('/user/getPermissions', { method: 'POST', body: { ...params } }) }

export function searchCustomer(params) { return request('/user/searchCustomer', { method: 'POST', body: { ...params } }) }

export function searchPerson(params) { return request('/user/searchPerson', { method: 'POST', body: { ...params } }) }