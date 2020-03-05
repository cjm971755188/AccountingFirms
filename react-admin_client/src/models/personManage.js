import { getList } from '../services/personManage';

/* import getList from '../mock/personManage/getList' */
import getDetail from '../mock/personManage/getDetail'
import getPosition from '../mock/personManage/getPositions'
import def from '../mock/default'

export default {
  namespace: 'personManage',
  state: {
    list: {
      data: [],
      pageNum: 0,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      username: '',
      name: '',
      position: 'all',
      state: 'all'
    },
    comfirmData: {
      choosedUsername: '',
      choosedName: '',
      choosedPosition: 'all',
      choosedState: 'all'
    },
    detail: [],
    positions: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const res = yield call(getList, payload); 
        /* const res = getList */
        console.log('payload: ', payload)
        console.log('res: ', res)
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
        /* const res = yield call(create, payload); */ 
        const res = yield def
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
        /* const res = yield call(getDetail, payload); */ 
        const res = getDetail
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
    *edit({ payload }, { call, put }) {
      try {
        /* const res = yield call(create, payload); */ 
        const res = yield def
        if (res.code === 200) {
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getPositions({ payload }, { call, put }) {
      try {
        /* const res = yield call(getPosition, payload); */ 
        const res = getPosition
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
    *del({ payload }, { call, put }) {
      try {
        /* const res = yield call(del, payload); */ 
        const res = yield def
        if (res.code === 200) {
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
          data: [],
          pageNum: 0,
          pageSize: 10,
          total: 0
        },
        currentParameter: {
          username: '',
          name: '',
          position: 'all',
          state: 'all'
        },
        comfirmData: {
          choosedUsername:'',
          choosedName: '',
          choosedPosition: 'all',
          choosedState: 'all'
        },
      };
    },
  },
};
