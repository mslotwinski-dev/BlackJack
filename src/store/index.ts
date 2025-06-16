import { createStore } from 'vuex'

export default createStore({
  state: {
    cash: localStorage.getItem('cash')
      ? Number(localStorage.getItem('cash'))
      : 100,
  },
  getters: {
    getCash: (state) => state.cash,

    isPossibleToBuy: (state) => (price: number) => {
      return state.cash >= price
    },
  },
  mutations: {
    setCash: (state, cash: number) => {
      state.cash = cash
      localStorage.setItem('cash', String(cash))
    },
  },
  actions: {
    takeCash: ({ commit, state }, price: number) => {
      if (state.cash >= price) {
        commit('setCash', state.cash - price)
      }
    },
    giveCash: ({ commit, state }, price: number) => {
      commit('setCash', state.cash + price)
    },
  },
  modules: {},
})
