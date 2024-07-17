<template>
  <v-navigation-drawer permanent>
    <!-- 側邊導航欄頭部 -->
    <v-list>
      <!--  :prepend-avatar 設置列表項目的前置頭像 -->
      <v-list-item :prepend-avatar="avatar" :title="user.account"></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <!-- 側邊導航欄菜單項目 -->
    <v-list>
      <v-list-item
        v-for="item in navItems" :key="item.to"
        :to="item.to" :title="item.text" :prepend-icon="item.icon"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!-- 主要內容區域 -->
  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const user = useUserStore() // 使用 useUserStore() 來獲取用戶信息

// 定義側邊導航欄的菜單項目
const navItems = [
  { to: '/admin/products', text: '商品管理', icon: 'mdi-shopping' },
  { to: '/admin/orders', text: '訂單管理', icon: 'mdi-list-box' },
  { to: '/', text: '回首頁', icon: 'mdi-home' }
]

// 計算屬性，用來生成用戶頭像的 URL
const avatar = computed(() => {
  return `https://api.multiavatar.com/${user.account}.png`
})
</script>
