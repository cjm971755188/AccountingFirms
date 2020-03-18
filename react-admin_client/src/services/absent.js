import request from '../utils/request';

export function getAbsentList(params) { return request('/absent/getAbsentList', { method: 'POST', body: { ...params } }) }

export function createAbsent(params) { return request('/absent/createAbsent', { method: 'POST', body: { ...params } }) }

export function getDetail(params) { return request('/absent/getDetail', { method: 'POST', body: { ...params } }) }

export function approval(params) { return request('/absent/approval', { method: 'POST', body: { ...params } }) }

export function deleteAbsent(params) { return request('/absent/deleteAbsent', { method: 'POST', body: { ...params } }) }