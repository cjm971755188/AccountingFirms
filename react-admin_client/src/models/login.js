/* eslint-disable no-console */
import { loginUser } from '../services/login';

export default {
  namespace: 'login',
  state: {
    loginData: []
  },

  effects: {
    *loginUser({ payload }, { call, put }) {
      console.log('payload:', payload)
      const res = yield call(loginUser, payload); 
      console.log('res: ', res)
      if (!res) {
        return;
      }
      yield put({
        type: 'save',
        payload: res.data
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        loginData: payload
      };
    },
    reset() {
      return {
        loginData: []
      };
    },
  },
};
