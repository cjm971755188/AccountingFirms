import request from '../utils/request';

export function getCustomerTypeList(params) { return request('/customerType/getCustomerTypeList', { method: 'POST', body: { ...params } }) }