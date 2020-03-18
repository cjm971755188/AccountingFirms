import { getBusinessList, createBusiness, deleteBusiness, didComplete, didPay, getBusinessTypes, getGuides } from '../../services/business';

export default {
  namespace: 'business',
  state: {
    list: {
      data: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      uid: '',
      cid: '',
      btid: 'all',
      progress: 'all'
    },
    comfirmData: {
      choosedUid: '',
      choosedCid: '',
      choosedBtid: 'all',
      choosedProgress: 'all'
    },
    detail: [],
    businessTypes: [],
    guides: [],
    users: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const res = yield call(getBusinessList, payload); 
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
        const res = yield call(createBusiness, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *del({ payload }, { call, put }) {
      try {
        const res = yield call(deleteBusiness, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *didComplete({ payload }, { call, put }) {
      try {
        const res = yield call(didComplete, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *didPay({ payload }, { call, put }) {
      try {
        const res = yield call(didPay, payload); 
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getBusinessTypes({ payload }, { call, put }) {
      try {
        const res = yield call(getBusinessTypes, payload); 
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'businessTypes'
          });
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getGuides({ payload }, { call, put }) {
      try {
        const res = yield call(getGuides, payload);
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'guides'
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
    reset(state) {
      return {
        ...state,
        list: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        currentParameter: {
          uid: '',
          cid: '',
          btid: 'all',
          progress: 'all'
        },
        comfirmData: {
          choosedUid: '',
          choosedCid: '',
          choosedBtid: 'all',
          choosedProgress: 'all'
        },
      };
    },
  },
};
