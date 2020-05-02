import { getBusinessList, getCustomerList, didPayB, didPayC } from '../../services/workspace';

export default {
  namespace: 'workspace',
  state: {
    businessList: {
      data: [],
      pageNum: 1,
      pageSize: 8,
      total: 0
    },
    customerList: {
      data: [],
      pageNum: 1,
      pageSize: 8,
      total: 0
    }
  },

  effects: {
    *getBusinessList({ payload }, { call, put }) {
      try {
        const res = yield call(getBusinessList, payload);
        yield put({
          type: 'save',
          payload: res.data,
          index: 'businessList'
        });
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getCustomerList({ payload }, { call, put }) {
      try {
        const res = yield call(getCustomerList, payload);
        yield put({
          type: 'save',
          payload: res.data,
          index: 'customerList'
        });
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *didPayB({ payload }, { call, put }) {
      try {
        const res = yield call(didPayB, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *didPayC({ payload }, { call, put }) {
      try {
        const res = yield call(didPayC, payload);
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
          pageSize: 8,
          total: 0
        },
      };
    },
  },
};
