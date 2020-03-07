import request from '../utils/request';

export function getLeaveList(params) { return request('/leave/getLeaveList', { method: 'POST', body: { ...params } }) }

export function createLeave(params) { return request('/leave/createLeave', { method: 'POST', body: { ...params } }) }

export function getDetail(params) { return request('/leave/getDetail', { method: 'POST', body: { ...params } }) }

export function approval(params) { return request('/leave/approval', { method: 'POST', body: { ...params } }) }

export function deleteLeave(params) { return request('/leave/deleteLeave', { method: 'POST', body: { ...params } }) }

export function searchPerson(params) { return request('/other/searchPerson', { method: 'POST', body: { ...params } }) }