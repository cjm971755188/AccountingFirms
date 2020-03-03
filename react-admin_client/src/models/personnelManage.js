/* import { getList, getDetail, getPosition, resetPassWord } from '../services/personnelManage'; */

import getList from '../mock/personnelManage/getList'
import getDetail from '../mock/personnelManage/getDetail'
import getPosition from '../mock/personnelManage/getPositions'
import def from '../mock/default'

export default {
  namespace: 'personnelManage',
  state: {
    list: {
      data: [],
      pageNum: 0,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      uid: '',
      name: '',
      position: 'all',
      state: 'all'
    },
    comfirmData: {
      choosedUid: '',
      choosedName: '',
      choosedPosition: 'all',
      choosedState: 'all'
    },
    detail: [],
    positions: [],
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
    *edit({ payload }, { call, put }) {
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
    *getPositions({ payload }, { call, put }) {
      try {
        /* const res = yield call(getPosition, payload); */ 
        const res = getPosition
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'positions'
          });
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
          uid: '',
          name: '',
          position: 'all',
          state: 'all'
        },
        comfirmData: {
          choosedUid:'',
          choosedName: '',
          choosedPosition: 'all',
          choosedState: 'all'
        },
      };
    },
  },
};
