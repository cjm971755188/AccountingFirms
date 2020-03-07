import { getPersonList, createPerson, editPerson, deletePerson, getPositions, getPermissions } from '../services/personManage';

export default {
  namespace: 'personManage',
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
      pid: 'all',
      absent: 'all'
    },
    comfirmData: {
      choosedUsername: '',
      choosedName: '',
      choosedPid: 'all',
      choosedAbsent: 'all'
    },
    detail: [],
    positions: [],
    permissions: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const res = yield call(getPersonList, payload);
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
        const res = yield call(createPerson, payload);
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
        const res = yield call(editPerson, payload);
        console.log(res)
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
        const res = yield call(deletePerson, payload);
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
        const res = yield call(createPerson, payload);
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
    *getPositions({ payload }, { call, put }) {
      try {
        const res = yield call(getPositions, payload);
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
    *getPermissions({ payload }, { call, put }) {
      try {
        const res = yield call(getPermissions, payload);
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
    }
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
          pid: 'all',
          absent: 'all'
        },
        comfirmData: {
          choosedUsername:'',
          choosedName: '',
          choosedPid: 'all',
          choosedAbsent: 'all'
        },
      };
    },
  },
};
