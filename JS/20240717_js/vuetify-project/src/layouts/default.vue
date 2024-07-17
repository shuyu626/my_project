<template>
  <!-- 手機版側欄 -->
  <v-navigation-drawer v-if="mobile" v-model="drawer">
    <!-- nav 用於指示這個列表是導航列表 -->
    <v-list nav>
      <!-- 動態顯示導航項目 -->
      <template v-for="item in navItems" :key="item.to">
        <v-list-item
          :prepend-icon="item.icon" :to="item.to"
          :title="item.text"
          v-if="item.show"
        >
        <!-- 如果是購物車，顯示購物車數量的徽章 -->
          <template #append>
            <v-badge color="error" :content="user.cart" v-if="item.to === '/cart' && user.cart > 0" inline></v-badge>
          </template>
        </v-list-item>
      </template>
       <!-- 登出按鈕 -->
      <v-list-item prepend-icon="mdi-account-arrow-right" v-if="user.isLogin" title="登出" @click="logout"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!-- 導覽列 -->
  <v-app-bar>
    <v-container class="d-flex align-center">
      <!-- 標題 -->
      <v-btn to="/" :active="false">購物網</v-btn>
      <v-spacer />
      <template v-if="mobile">
        <!-- 手機板漢堡按鈕 -->
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      </template>
      <template v-else>
        <!-- 電腦版選單 -->
        <template v-for="item in navItems" :key="item.to">
          <v-btn v-if="item.show" :prepend-icon="item.icon" :to="item.to">
            {{ item.text }}
            <v-badge color="red" :content="user.cart" v-if="item.to === '/cart' && user.cart > 0" floating></v-badge>
          </v-btn>
        </template>
        <!-- 登出按鈕 -->
        <v-btn prepend-icon="mdi-account-arrow-right" v-if="user.isLogin" @click="logout">登出</v-btn>
      </template>
    </v-container>
  </v-app-bar>
  <!-- 主要內容 -->
  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useUserStore } from '@/stores/user'
import { useSnackbar } from 'vuetify-use-dialog'

const { mobile } = useDisplay() // 獲取手機端的顯示狀態
const user = useUserStore() // 獲取用戶的狀態和資訊
const createSnackbar = useSnackbar() // 創建顯示訊息的功能

const drawer = ref(false)

// 導覽列
// 使用 computed 屬性 navItems 來動態生成導航項目的配置，
// 根據用戶是否登入和是否是管理員來決定顯示哪些項目
const navItems = computed(() => {
  return [
    { to: '/register', text: '註冊', icon: 'mdi-account-plus', show: !user.isLogin },
    { to: '/login', text: '登入', icon: 'mdi-account-arrow-left', show: !user.isLogin },
    { to: '/cart', text: '購物車', icon: 'mdi-cart', show: user.isLogin },
    { to: '/orders', text: '訂單', icon: 'mdi-list-box', show: user.isLogin },
    { to: '/admin', text: '管理', icon: 'mdi-cog', show: user.isLogin && user.isAdmin }
  ]
})

// 登出後下方會跳綠色框顯示登出成功
const logout = async () => {
  await user.logout() // 等待使用者登出
  // createSnackbar({ }) 用於顯示 訊息提示框
  createSnackbar({
    text: '登出成功',
    snackbarProps: {
      color: 'green'
    }
  })
}
</script>
