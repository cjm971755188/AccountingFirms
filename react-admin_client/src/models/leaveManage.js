/* import { getList, getDetail, getPosition, resetPassWord } from '../services/personnelManage'; */

import getList from '../mock/leaveManage/getList'
import getDetail from '../mock/leaveManage/getDetail'
import def from '../mock/default'

export default {
  namespace: 'leaveManage',
  state: {
    list: {
      data: [],
      pageNum: 0,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      name: '',
      type: 'all',
      date: 'all',
      state: 'all'
    },
    comfirmData: {
      choosedName: '',
      choosedType: 'all',
      choosedDate: 'all',
      choosedState: 'all',
    },
    detail: []
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
    *approval({ payload }, { call, put }) {
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
          type: 'all',
          date: 'all',
          state: 'all'
        },
        comfirmData: {
          choosedName: '',
          choosedType: 'all',
          choosedDate: 'all',
          choosedState: 'all',
        },
      };
    },
  },
};
