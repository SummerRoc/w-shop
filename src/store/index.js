import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    collapse: false,
    commondityInfo:{},
    menuBar: [],
  },
  getters: {},
  mutations: {
    changeCollapse: (state) => {
      state.collapse = !state.collapse
    },
    getCommondityInfo: (state, payload) => {
      state.commondityInfo = payload
    },
    setMenuBar: (state, payload) => {
      state.menuBar = payload
    },
  },
  actions: {
  async setValFunc({state,commit}, val){
    commit("setMenuBar", val);
},
  },
  modules: {}
})