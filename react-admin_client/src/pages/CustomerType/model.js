import { getCustomerTypeList, createCustomerType, editCustomerType, deleteCustomerType, getSalaryList, createSalary, editSalary, deleteSalary } from '../../services/customerType';

export default {
  namespace: 'customerType',
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
        const res = yield call(getCustomerTypeList, payload);
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
    *createCustomerType({ payload }, { call, put }) {
      try {
        const res = yield call(createCustomerType, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *editCustomerType({ payload }, { call, put }) {
      try {
        const res = yield call(editCustomerType, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *deleteCustomerType({ payload }, { call, put }) {
      try {
        const res = yield call(deleteCustomerType, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getSalaryList({ payload }, { call, put }) {
      try {
        const res = yield call(getSalaryList, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *createSalary({ payload }, { call, put }) {
      try {
        const res = yield call(createSalary, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *editSalary({ payload }, { call, put }) {
      try {
        const res = yield call(editSalary, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *deleteSalary({ payload }, { call, put }) {
      try {
        const res = yield call(deleteSalary, payload);
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
