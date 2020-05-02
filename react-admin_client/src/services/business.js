import request from '../utils/request';

export function getBusinessList(params) { return request('/business/getBusinessList', { method: 'POST', body: { ...params } }) }

export function createBusiness(params) { return request('/business/createBusiness', { method: 'POST', body: { ...params } }) }

export function deleteBusiness(params) { return request('/business/deleteBusiness', { method: 'POST', body: { ...params } }) }

export function didComplete(params) { return request('/business/didComplete', { method: 'POST', body: { ...params } }) }

export function didPay(params) { return request('/business/didPay', { method: 'POST', body: { ...params } }) }

export function getAnalysis(params) { return request('/business/getAnalysis', { method: 'POST', body: { ...params } }) }

export function getBusinessTypes(params) { return request('/business/getBusinessTypes', { method: 'POST', body: { ...params } }) }

export function getUsers(params) { return request('/business/getUsers', { method: 'POST', body: { ...params } }) }

export function getGuides(params) { return request('/business/getGuides', { method: 'POST', body: { ...params } }) }