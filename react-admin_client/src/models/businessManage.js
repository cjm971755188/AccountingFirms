/* import { getList, getDetail, getPosition, resetPassWord } from '../services/personnelManage'; */

import getList from '../mock/businessManage/getList'
import getBusinessTypes from '../mock/businessManage/getBusinessTypes'
import getHelps from '../mock/businessManage/getHelps'
import def from '../mock/default'

export default {
  namespace: 'businessManage',
  state: {
    list: {
      data: [],
      pageNum: 0,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      btid: '',
      accountant: '',
      customer: '',
      type: 'all',
      state: 'all'
    },
    comfirmData: {
      choosedBtid: '',
      choosedAccountant: '',
      choosedCustomer: '',
      choosedType: 'all',
      choosedState: 'all'
    },
    detail: [],
    businessTypes: [],
    helps: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        /* const res = yield call(getList, payload); */ 
        const res = getList
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'list'
          });
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getBusinessTypes({ payload }, { call, put }) {
      try {
        /* const res = yield call(create, payload); */ 
        const res = yield getBusinessTypes
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'businessTypes'
          });
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getHelps({ payload }, { call, put }) {
      try {
        /* const res = yield call(create, payload); */ 
        const res = yield getHelps
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'helps'
          });
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *create({ payload }, { call, put }) {
      try {
        /* const res = yield call(create, payload); */ 
        const res = yield def
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *didSuccess({ payload }, { call, put }) {
      try {
        /* const res = yield call(del, payload); */ 
        const res = yield def
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *didPay({ payload }, { call, put }) {
      try {
        /* const res = yield call(del, payload); */ 
        const res = yield def
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *del({ payload }, { call, put }) {
      try {
        /* const res = yield call(del, payload); */ 
        const res = yield def
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },

  reducers: {
    save(state, { payload, index }) {
      return {
        ...state,
        [index]: {
          ...state[index],
          ...payload,
        },
      };
    },
    reset(state) {
      return {
        ...state,
        list: {
          data: [],
          pageNum: 0,
          pageSize: 10,
          total: 0
        },
        currentParameter: {
          id: '',
          accountant: '',
          customer: '',
          type: 'all',
          state: 'all'
        },
        comfirmData: {
          choosedBtid: '',
          choosedAccountant: '',
          choosedCustomer: '',
          choosedType: 'all',
          choosedState: 'all'
        }
      };
    },
  },
};
