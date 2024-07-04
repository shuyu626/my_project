<template>
  <!-- 側邊攔的狀態跟變數綁定 -->
  <v-navigation-drawer v-if="mobile" v-model="drawer">
    <v-list nav>
      <v-list-item
      v-for="item in navItems" :key="item.to"
      :prepend-icon="item.icon" :to="item.to"
      :title="item.text"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar>
    <v-container class="d-flex align-center">
      <!-- :active="false" 取消啟用的狀態 -->
      <v-btn to="/" :active="false">購物網</v-btn>
      <v-spacer/>
      <!-- 如果是手機的話 -->
      <template v-if="mobile">
        <v-app-bar-nav-icon  @click="drawer = true"></v-app-bar-nav-icon>
      </template>
      <template v-else>
        <v-btn v-for="item in navItems" :key="item.to" :prepend-icon="item.icon" :to="item.to">{{ item.text }}</v-btn>
      </template>
    </v-container>
  </v-app-bar>
  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const drawer = ref(false)

// 導覽列
const navItems = [
  { to: '/register', text: '註冊', icon: 'mdi-account-plus' },
  { to: '/login', text: '登入', icon: 'mdi-account-arrow-left' },
  { to: '/cart', text: '購物車', icon: 'mdi-cart' },
  { to: '/orders', text: '訂單', icon: 'mdi-list-box' },
  { to: '/admin', text: '管理', icon: 'mdi-cog' }

]
</script>
