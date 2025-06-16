import { defineStore } from 'pinia'

export const useCashStore = defineStore('cash', {
  state: () => ({
    cash: (() => {
      if (localStorage.getItem('cash') === null) {
        localStorage.setItem('cash', '100')
      }
      const stored = Number(localStorage.getItem('cash'))
      return isNaN(stored) ? 100 : stored
    })(),
  }),
  getters: {
    getCash: (state) => state.cash,
    isPossibleToBuy: (state) => (price: number) => state.cash >= price,
  },
  actions: {
    setCash(cash: number) {
      this.cash = cash
      localStorage.setItem('cash', String(cash))
    },
    takeCash(price: number) {
      if (this.cash >= price) {
        this.setCash(this.cash - price)
      }
    },
    addCash(price: number) {
      this.setCash(this.cash + price)
    },
  },
})
