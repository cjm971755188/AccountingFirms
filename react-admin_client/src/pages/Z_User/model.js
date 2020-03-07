import { userLogin } from '../../services/user';

export default {
  namespace: 'user',
  state: {
    user: []
  },

  effects: {
    *userLogin({ payload }, { call, put }) {
      try {
        const res = yield call(userLogin, payload);
        yield put({
          type: 'save',
          payload: res.data,
          index: 'user'
        });
        localStorage.setItem('user', JSON.stringify(res.data));
        return Promise.resolve(res);
      } catch (e) {
        console.log('e: ', e)
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

  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'save',
        payload: JSON.parse(localStorage.getItem('user') || {}),
        index: 'user'
      });
    },
  },
};
