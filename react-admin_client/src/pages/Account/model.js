/* import { getList, getDetail, getPosition, resetPassWord } from '../services/personnel'; */

export default {
  namespace: 'account',
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
    },
    comfirmData: {
      choosedUid: '',
      choosedName: '',
    },
    permissions: [],
  },

  effects: {
    /* *fetchList({ payload }, { call, put }) {
      try {
        const res = yield call(getList, payload); 
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
        const res = yield call(create, payload); 
        const res = yield def
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *edit({ payload }, { call, put }) {
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
    },
    *getPermissions({ payload }, { call, put }) {
      try {
        const res = yield call(getPosition, payload); 
        const res = getPermissions
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'permissions'
          });
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *changePermissions({ payload }, { call, put }) {
      try {
        const res = yield call(adjust, payload); 
        const res = yield def
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *resetPassWord({ payload }, { call, put }) {
      try {
        const res = yield call(resetPassWord, payload); 
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
        const res = yield call(del, payload); 
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
          data: [],
          pageNum: 0,
          pageSize: 10,
          total: 0
        },
        currentParameter: {
          uid: '',
          name: '',
        },
        comfirmData: {
          choosedUid:'',
          choosedName: '',
        },
      };
    },
  },
};
