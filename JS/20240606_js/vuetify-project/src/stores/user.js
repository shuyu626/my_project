import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  // state 保存的資料
  // state () {
  //   return {
  //     number: 0
  //   }
  // }
  // 直接return不需要大括號，但會以為是functioin的大括號
  // state:()=>{
  //   return{
  //     number:0
  //   }
  // }
  state: () => ({
    number: 0
  }),
  // actions 修改資料的 function
  actions: {
    plus () {
      this.number++
    },
    minus () {
      this.number--
    }
  },
  // getters 取資料的 function
  // 類似computed
  getters: {
    square () {
      return Math.pow(this.number, 2)
    }
  }
})
