import request from '../utils/request';

export function getBusinessTypeList(params) { return request('/businessType/getBusinessTypeList', { method: 'POST', body: { ...params } }) }

export function createBusinessType(params) { return request('/businessType/createBusinessType', { method: 'POST', body: { ...params } }) }

export function editBusinessType(params) { return request('/businessType/editBusinessType', { method: 'POST', body: { ...params } }) }

export function deleteBusinessType(params) { return request('/businessType/deleteBusinessType', { method: 'POST', body: { ...params } }) }

export function getGuideList(params) { return request('/businessType/getGuideList', { method: 'POST', body: { ...params } }) }

export function createGuide(params) { return request('/businessType/createGuide', { method: 'POST', body: { ...params } }) }

export function editGuide(params) { return request('/businessType/editGuide', { method: 'POST', body: { ...params } }) }

export function deleteGuide(params) { return request('/businessType/deleteGuide', { method: 'POST', body: { ...params } }) }