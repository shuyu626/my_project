<!-- 定義代辦事項列表的頁面結構和行為 -->
<!-- template  描述了代辦事項列表頁面的 HTML 結構，包括標題和新增事項的輸入框 -->
<!-- script setup 定義了一些資料綁定和方法，例如新增事項、輸入驗證等 -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">代辦事項</h1>
      </v-col>
      <v-col cols="12">
        <v-text-field
          variant="outlined"
          label="新增事項"
          clearable
          append-icon="mdi-plus"
          @keydown.enter="onInputSubmit"
          @click:append="onInputSubmit"
          v-model="newItem"
          :rules="[rules.required, rules.length]"
          ref="newItemTextField"
        ></v-text-field>
        <v-table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="item.id">
              <td>
                <span v-show="!item.edit">{{ item.name }}</span>
                <v-text-field
                  v-show="item.edit"
                  v-model="item.model"
                  :rules="[rules.required, rules.length]"
                  autofocus
                  @keydown.enter="onEditInputSubmit(item.id, i)"
                  ref="editItemTextField"
                ></v-text-field>
              </td>
              <td>
                <!-- 如果不是編輯中 -->
                <template v-if="!item.edit">
                  <v-btn icon="mdi-pencil" @click="editItem(item.id)"></v-btn>
                  <v-btn icon="mdi-delete" @click="delItem(item.id)"></v-btn>
                </template>
                <template v-else>
                  <v-btn icon="mdi-check" @click="onEditInputSubmit(item.id, i)"></v-btn>
                  <v-btn icon="mdi-undo" @click="cancelEditItem(item.id)"></v-btn>
                </template>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useListStore } from '@/stores/list'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { definePage } from 'vue-router/auto'

// 定義頁面的標題
definePage({
  meta: {
    title: '番茄鐘 | 清單'
  }
})

const list = useListStore()
// 不須加 ref 、 reactive，因為 function 是固定不變的
const { addItem, editItem, delItem, cancelEditItem, confirmEditItem } = list
// state會變，要放storeToRefs 維持響應
const { items } = storeToRefs(list)

const newItem = ref('')
const newItemTextField = ref(null)
// 在v-for裡，所以要寫陣列
const editItemTextField = ref([])

const rules = {
  // vlaue代表使用者輸入的值
  // return true 代表驗證通過，false或文字代表失敗
  required: (value) => {
    // !代表false，!!代表true，轉為布林值，類似'文字'*1轉為數字的概念
    // !!'abc'
    // return !!value || 'Field is required'
    return Boolean(value) || '欄位必填'
  },
  length: (value) => {
    return value.length >= 3 || '必須三個字以上'
  }
}

const onInputSubmit = async () => {
  // 把所有驗證失敗的訊息放在陣列給你
  // promise 就要用 await，await就要用async
  const validate = await newItemTextField.value.validate()
  console.log(validate)
  if (validate.length > 0) return
  addItem(newItem.value)
  newItemTextField.value.reset()
}

const onEditInputSubmit = async (id, i) => {
  const validate = await editItemTextField.value[i].validate()
  if (validate.length > 0) return
  confirmEditItem(id)
}
</script>
