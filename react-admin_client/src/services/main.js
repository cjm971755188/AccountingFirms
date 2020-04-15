import request from '../utils/request';

export function getBusinessList(params) { return request('/business/getBusinessList', { method: 'POST', body: { ...params } }) }

export function getCustomerList(params) { return request('/customer/getCustomerList', { method: 'POST', body: { ...params } }) }

export function didPayB(params) { return request('/business/didPay', { method: 'POST', body: { ...params } }) }

export function didPayC(params) { return request('/customer/didPay', { method: 'POST', body: { ...params } }) }