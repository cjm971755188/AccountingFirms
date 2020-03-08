import request from '../utils/request';

export function getCustomerTypeList(params) { return request('/customerType/getCustomerTypeList', { method: 'POST', body: { ...params } }) }

export function createCustomerType(params) { return request('/customerType/createCustomerType', { method: 'POST', body: { ...params } }) }

export function editCustomerType(params) { return request('/customerType/editCustomerType', { method: 'POST', body: { ...params } }) }

export function deleteCustomerType(params) { return request('/customerType/deleteCustomerType', { method: 'POST', body: { ...params } }) }

export function getSalaryList(params) { return request('/customerType/getSalaryList', { method: 'POST', body: { ...params } }) }

export function createSalary(params) { return request('/customerType/createSalary', { method: 'POST', body: { ...params } }) }

export function editSalary(params) { return request('/customerType/editSalary', { method: 'POST', body: { ...params } }) }

export function deleteSalary(params) { return request('/customerType/deleteSalary', { method: 'POST', body: { ...params } }) }