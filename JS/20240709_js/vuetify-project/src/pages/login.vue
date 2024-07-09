<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-center">登入</h1>
        </v-col>
        <v-divider></v-divider>
        <v-col cols="12">
          <v-form :disabled="isSubmitting" @submit.prevent="submit">
            <v-text-field
              label="帳號"
              minlength="4" maxlength="20" counter
              v-model="account.value.value"
              :error-messages="account.errorMessage.value"
            ></v-text-field>
            <v-text-field
              label="密碼"
              minlength="4" maxlength="20" counter
              type="password"
              v-model="password.value.value"
              :error-messages="password.errorMessage.value"
            ></v-text-field>
            <div class="text-center">
              <v-btn type="submit" color="green" :loading="isSubmitting">登入</v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import validator from 'validator'
import { definePage } from 'vue-router/auto'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'

definePage({
  meta: {
    title: '購物網 | 登入'
  }
})

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

// 使用 yup 庫定義表單驗證的 schema
const schema = yup.object({
  account: yup
    .string()
    .required('使用者帳號必填')
    .min(4, '使用者帳號長度不符')
    .max(20, '使用者帳號長度不符')
    .test(
      // .test(自訂驗證名稱, 錯誤訊息, 驗證 function)
      'isAlphanumeric', '使用者帳號格式錯誤',
      (value) => {
        // 驗證函式，檢查帳號是否是字母或數字
        return validator.isAlphanumeric(value)
      }
    ),
  password: yup
    .string()
    .required('使用者密碼必填')
    .min(4, '使用者密碼長度不符')
    .max(20, '使用者密碼長度不符')
})

// 使用 useForm 從 vee-validate 中獲取表單驗證相關的鉤子
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema // 傳入上面定義的 schema 作為驗證模式
})
// 使用 useField 從 vee-validate 中獲取 'account' 和 'password' 字段的鉤子
const account = useField('account')
const password = useField('password')

// 定義表單提交的處理函式
const submit = handleSubmit(async (values) => {
  // 呼叫 user store 中的 login 方法進行使用者登入，並獲取結果
  const result = await user.login(values)
  if (result === '登入成功') {
    // 如果登入成功，跳出綠色視窗(登入成功)
    createSnackbar({
      text: '登入成功',
      snackbarProps: {
        color: 'green'
      }
    })
    router.push('/')
  } else {
    // 如果登入失敗，跳出紅色視窗
    createSnackbar({
      text: result,
      snackbarProps: {
        color: 'red'
      }
    })
  }
})
</script>
