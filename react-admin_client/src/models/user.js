/* import { userLogin } from '../services/user'; */

import getUser from '../mock/user/getUser'
import def from '../mock/default'

export default {
  namespace: 'user',
  state: {
    user: []
  },

  effects: {
    *userLogin({ payload }, { call, put }) {
      try {
        /* const res = yield call(userLogin, payload); */ 
        const res = yield def
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getUser({ payload }, { call, put }) {
      try {
        /* const res = yield call(userLogin, payload); */ 
        const res = getUser
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'user'
          });
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
  },
};
