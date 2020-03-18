import { getDepartmentList, createDepartment, editDepartment, deleteDepartment } from '../../services/department';

export default {
  namespace: 'department',
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
        const res = yield call(getDepartmentList, payload); 
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
    *createDepartment({ payload }, { call, put }) {
      try {
        const res = yield call(createDepartment, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *editDepartment({ payload }, { call, put }) {
      try {
        const res = yield call(editDepartment, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *deleteDepartment({ payload }, { call, put }) {
      try {
        const res = yield call(deleteDepartment, payload); 
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
