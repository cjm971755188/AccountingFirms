import request from '../utils/request';

export function getCustomerList(params) { return request('/customer/getCustomerList', { method: 'POST', body: { ...params } }) }

export function createCustomer(params) { return request('/customer/createCustomer', { method: 'POST', body: { ...params } }) }

export function editCustomer(params) { return request('/customer/editCustomer', { method: 'POST', body: { ...params } }) }

export function deleteCustomer(params) { return request('/customer/deleteCustomer', { method: 'POST', body: { ...params } }) }

export function didComplete(params) { return request('/customer/didComplete', { method: 'POST', body: { ...params } }) }

export function didPay(params) { return request('/customer/didPay', { method: 'POST', body: { ...params } }) }

export function getAnalysis(params) { return request('/customer/getAnalysis', { method: 'POST', body: { ...params } }) }

export function getCustomerTypes(params) { return request('/customer/getCustomerTypes', { method: 'POST', body: { ...params } }) }

export function getSalarys(params) { return request('/customer/getSalarys', { method: 'POST', body: { ...params } }) }

export function getUsers(params) { return request('/customer/getUsers', { method: 'POST', body: { ...params } }) }