import { getBusinessTypeList, createBusinessType, editBusinessType, deleteBusinessType, getGuideList, createGuide, editGuide, deleteGuide } from '../../services/businessType';

export default {
  namespace: 'businessType',
  state: {
    list: {
      data: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      name: '',
    },
    comfirmData: {
      choosedName: '',
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const res = yield call(getBusinessTypeList, payload);
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
    *createBusinessType({ payload }, { call, put }) {
      try {
        const res = yield call(createBusinessType, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *editBusinessType({ payload }, { call, put }) {
      try {
        const res = yield call(editBusinessType, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *deleteBusinessType({ payload }, { call, put }) {
      try {
        const res = yield call(deleteBusinessType, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getGuideList({ payload }, { call, put }) {
      try {
        const res = yield call(getGuideList, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *createGuide({ payload }, { call, put }) {
      try {
        const res = yield call(createGuide, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *editGuide({ payload }, { call, put }) {
      try {
        const res = yield call(editGuide, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *deleteGuide({ payload }, { call, put }) {
      try {
        const res = yield call(deleteGuide, payload);
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
        },
        comfirmData: {
          choosedName: '',
        },
      };
    },
  },
};
