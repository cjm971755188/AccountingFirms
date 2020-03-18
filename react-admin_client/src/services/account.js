import request from '../utils/request';

export function getAccountList(params) { return request('/account/getAccountList', { method: 'POST', body: { ...params } }) }

export function create(params) { return request('/account/create', { method: 'POST', body: { ...params } }) }

export function changePermissions(params) { return request('/account/changePermissions', { method: 'POST', body: { ...params } }) }

export function resetPassWord(params) { return request('/account/resetPassWord', { method: 'POST', body: { ...params } }) }

export function lockOrUnlock(params) { return request('/account/lockOrUnlock', { method: 'POST', body: { ...params } }) }

export function getDepartments(params) { return request('/account/getDepartments', { method: 'POST', body: { ...params } }) }