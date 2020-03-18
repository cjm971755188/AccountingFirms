import { getAccountList, create, changePermissions, resetPassWord, lockOrUnlock, getDepartments } from '../../services/account';

export default {
  namespace: 'account',
  state: {
    list: {
      data: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      username: '',
      name: '',
      did: 'all',
      pType: 'all',
      state: 'all',
    },
    comfirmData: {
      choosedUsername: '',
      choosedName: '',
      choosedDid: 'all',
      choosedPType: 'all',
      choosedState: 'all',
    },
    departments: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const res = yield call(getAccountList, payload); 
        yield put({
          type: 'save',
          payload: res.data,
          index: 'list'
        });
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *create({ payload }, { call, put }) {
      try {
        const res = yield call(create, payload); 
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *changePermissions({ payload }, { call, put }) {
      try {
        const res = yield call(changePermissions, payload); 
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *resetPassWord({ payload }, { call, put }) {
      try {
        const res = yield call(resetPassWord, payload); 
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *lockOrUnlock({ payload }, { call, put }) {
      try {
        const res = yield call(lockOrUnlock, payload); 
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getDepartments({ payload }, { call, put }) {
      try {
        const res = yield call(getDepartments, payload);
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'departments'
          });
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /* *create({ payload }, { call, put }) {
      try {
        const res = yield call(create, payload); 
        const res = yield def
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    }, */
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
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        currentParameter: {
          username: '',
          name: '',
          did: 'all',
          pType: 'all',
          state: 'all',
        },
        comfirmData: {
          choosedUsername: '',
          choosedName: '',
          choosedDid: 'all',
          choosedPType: 'all',
          choosedState: 'all',
        },
      };
    },
  },
};
