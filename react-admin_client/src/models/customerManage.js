/* import { getList, getDetail, getPosition, resetPassWord } from '../services/personnelManage'; */

import getList from '../mock/customerManage/getList'
import getDetail from '../mock/customerManage/getDetail'
import getAccountTypes from '../mock/customerManage/getAccountTypes'
import getAccountants from '../mock/customerManage/getAccountants'
import def from '../mock/default'

export default {
  namespace: 'customerManage',
  state: {
    list: {
      data: [],
      pageNum: 0,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      name: '',
      makeAccount: 'all',
      type: 'all',
      state: 'all'
    },
    comfirmData: {
      choosedName: '',
      choosedMakeAccount: 'all',
      choosedType: 'all',
      choosedState: 'all'
    },
    detail: [],
    accountTypes: [],
    accountants: []
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
    *getAccountTypes({ payload }, { call, put }) {
      try {
        /* const res = yield call(getPosition, payload); */ 
        const res = getAccountTypes
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'accountTypes'
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
    *getAccountants({ payload }, { call, put }) {
      try {
        /* const res = yield call(getPosition, payload); */ 
        const res = getAccountants
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'accountants'
          });
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *allot({ payload }, { call, put }) {
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
    *getDetail({ payload }, { call, put }) {
      try {
        /* const res = yield call(getDetail, payload); */ 
        const res = getDetail
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'detail'
          });
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
          name: '',
          makeAccount: 'all',
          type: 'all',
          state: 'all'
        },
        comfirmData: {
          choosedName: '',
          choosedMakeAccount: 'all',
          choosedType: 'all',
          choosedState: 'all'
        },
      };
    },
  },
};
