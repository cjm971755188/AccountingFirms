import { getCustomerList, createCustomer, editCustomer, deleteCustomer, didPay, getCustomerTypes, getSalary } from '../../services/customer';

export default {
  namespace: 'customer',
  state: {
    list: {
      data: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      name: '',
      isAccount: 'all',
      ctid: 'all',
      credit: 'all'
    },
    comfirmData: {
      choosedName: '',
      choosedIsAccount: 'all',
      choosedCtid: 'all',
      choosedCredit: 'all'
    },
    detail: [],
    customerTypes: [],
    salarys: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const res = yield call(getCustomerList, payload);
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
        const res = yield call(createCustomer, payload); 
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *edit({ payload }, { call, put }) {
      try {
        const res = yield call(editCustomer, payload); 
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *del({ payload }, { call, put }) {
      try {
        const res = yield call(deleteCustomer, payload);
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /* *getDetail({ payload }, { call, put }) {
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
    }, */
    *didPay({ payload }, { call, put }) {
      try {
        const res = yield call(didPay, payload);
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getCustomerTypes({ payload }, { call, put }) {
      try {
        const res = yield call(getCustomerTypes, payload); 
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'customerTypes'
          });
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getSalarys({ payload }, { call, put }) {
      try {
        const res = yield call(getSalary, payload); 
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'salarys'
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
          name: '',
          isAccount: 'all',
          ctid: 'all',
          credit: 'all'
        },
        comfirmData: {
          choosedName: '',
          choosedIsAccount: 'all',
          choosedCtid: 'all',
          choosedCredit: 'all'
        },
      };
    },
  },
};
