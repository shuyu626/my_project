// 管理代辦事項列表的狀態和相關操作
// state 描述了代辦事項列表的狀態，包括 items 陣列和 id 變數
// actions 定義了一個 addItem 方法，用來在清單中新增事項
import { defineStore } from 'pinia'

// 被當文字所以轉成數字
const time = parseInt(import.meta.env.VITE_TIME)
const timeBreak = parseInt(import.meta.env.VITE_TIME_BREAK)

// 語法風格，先 define 再 use
export const useListStore = defineStore('list', {
  state: () => ({
    items: [],
    id: 1,
    // 倒數時間的預設值 (環境變數的值)
    timeleft: time,
    break: false,
    // 完成項目
    finishedItems: [],
    // 目前剩餘項目
    currentItem: ''
  }),
  actions: {
    addItem (value) {
      this.items.push({
        id: this.id++,
        name: value,
        edit: false,
        model: value
      })
    },
    // 尋找特定id在陣列中的索引位置
    findIndexById (id) {
      return this.items.findIndex(item => item.id === id)
    },
    editItem (id) {
      // 在 function 裡呼叫 function 用 this
      const i = this.findIndexById(id)
      //   indigo(i<0) return
      this.items[i].edit = true
    },
    delItem (id) {
      const i = this.findIndexById(id)
      this.items.splice(i, 1)
    },
    cancelEditItem (id) {
      const i = this.findIndexById(id)
      this.items[i].model = this.items[i].name
      this.items[i].edit = false
    },
    confirmEditItem (id) {
      const i = this.findIndexById(id)
      this.items[i].name = this.items[i].model
      this.items[i].edit = false
    },
    setCurrentItem () {
      this.currentItem = this.break ? '休息一下' : this.items.shift().name
    },
    countdown () {
      this.timeleft--
    },
    setFinishItem () {
      if (!this.break) {
        this.finishedItems.push({
          id: this.id++,
          name: this.currentItem
        })
      }
      this.currentItem = ''
      if (this.items.length > 0) {
        this.break = !this.break
      }
      this.timeleft = this.break ? timeBreak : time
    }
  }
})
