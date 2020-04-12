import { userLogin, getMenus, getPermissions, searchCustomer, searchPerson, editPerson, changePerson } from '../../services/user';

export default {
  namespace: 'user',
  state: {
    user: [],
    menus: []
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
        return Promise.reject(e);
      }
    },
    *getMenus({ payload }, { call, put }) {
      try {
        const res = yield call(getMenus, payload); 
        yield put({
          type: 'save',
          payload: res.data,
          index: 'menus'
        });
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getPermissions({ payload }, { call, put }) {
      try {
        const res = yield call(getPermissions, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *searchCustomer({ payload }, { call, put }) {
      try {
        const res = yield call(searchCustomer, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *searchPerson({ payload }, { call, put }) {
      try {
        const res = yield call(searchPerson, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *edit({ payload }, { call, put }) {
      try {
        const res = yield call(editPerson, payload);
        localStorage.setItem('user', JSON.stringify(res.data));
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *change({ payload }, { call, put }) {
      try {
        const res = yield call(changePerson, payload);
        return Promise.resolve(res);
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

  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'save',
        payload: JSON.parse(localStorage.getItem('user') || { user: '' }),
        index: 'user'
      });
    },
  },
};
