<template>
  <v-container class="h-100">
    <v-row class="h-100">
      <v-col cols="12">
        <h1 class="text-center">請選擇管理項目</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { definePage } from 'vue-router/auto' // 用於定義路由頁面的配置

definePage({
  meta: {
    title: '購物網 | 管理',
    login: true, // 登入才可以看
    admin: true // 管理員才可以看
  }
})
</script>

<!-- 設置路由的相關配置 ，yaml 格式的配置，常用於配置文件和資料交換-->
<!-- meta 指定路由頁面的特定配置 -->
<!-- layout:admin 使用一個名為 "admin" 的特定佈局來呈現此路由頁面的內容 -->
<route lang="yaml">
meta:
  layout: admin
</route>
