<template lang="pug">
h1 陽明山
input(type="button" value="回首頁" @click="goHome")
input(type="button" value="上一頁" @click="goPrev")
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
// 組合式語法風格 useRouter, useRoute
// 要呼叫function才可以用
const route = useRoute()
const router = useRouter()

console.log(route.path)

const goHome = () => {
  router.push('/')
//   router.push({ name: 'home' })
}

const goPrev = () => {
// -1 上一頁
  router.go(-1)
}
</script>

<!-- options API 寫法，不用import -->
<!-- <script>
export default {
  methods: {
    goHome () {
      this.$router.push('/')
    },
    goPrev () {
      this.$router.go(-1)
    }
  }
}
</script> -->
