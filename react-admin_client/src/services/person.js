import request from '../utils/request';

export function getPersonList(params) { return request('/person/getPersonList', { method: 'POST', body: { ...params } }) }

export function getDetail(params) { return request('/person/getDetail', { method: 'POST', body: { ...params } }) }

export function createPerson(params) { return request('/person/createPerson', { method: 'POST', body: { ...params } }) }

export function editPerson(params) { return request('/person/editPerson', { method: 'POST', body: { ...params } }) }

export function deletePerson(params) { return request('/person/deletePerson', { method: 'POST', body: { ...params } }) }

export function getDepartments(params) { return request('/person/getDepartments', { method: 'POST', body: { ...params } }) }