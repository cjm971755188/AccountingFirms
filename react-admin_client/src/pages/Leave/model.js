import { getLeaveList, createLeave, getDetail, approval, deleteLeave, searchPerson } from '../../services/leave';

export default {
  namespace: 'leave',
  state: {
    list: {
      data: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      name: '',
      type: 'all',
      progress: 'all'
    },
    comfirmData: {
      choosedName: '',
      choosedType: 'all',
      choosedProgress: 'all',
    },
    detail: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const res = yield call(getLeaveList, payload);
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
        const res = yield call(createLeave, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getDetail({ payload }, { call, put }) {
      try {
        const res = yield call(getDetail, payload);
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
        const res = yield call(approval, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *del({ payload }, { call, put }) {
      try {
        const res = yield call(deleteLeave, payload);
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
          name: '',
          type: 'all',
          progress: 'all'
        },
        comfirmData: {
          choosedName: '',
          choosedType: 'all',
          choosedProgress: 'all',
        },
      };
    },
  },
};
