/* import { getMenus } from '../services/home'; */

import menus from '../mock/home/menuTree'

export default {
  namespace: 'home',
  state: {
    menus: []
  },

  effects: {
    *getMenus({ payload }, { call, put }) {
      try {
        /* const res = yield call(getMenus, payload); */ 
        const res = menus
        if (res.code === 200) {
          yield put({
            type: 'saveArray',
            payload: res.data,
            index: 'menus'
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
    saveArray(state, { payload, index }) {
      return {
        ...state,
        [index]: payload
      };
    },
    saveObject(state, { payload, index }) {
      return {
        ...state,
        [index]: {
          ...state[index],
          ...payload,
        },
      };
    }
  },
};
