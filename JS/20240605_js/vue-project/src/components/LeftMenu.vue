<template lang="pug">
#menu
  h1 社團介紹
  ul
    li(
      v-for="club in clubs"
      :key="club"
      )
        //- | 代表後面接的是純文字
        | {{ club }}
</template>

<script setup>
const clubs = [
  '吉他社', '熱舞社', '棒球社', '羽球社', '足球社', '童軍社'
]
</script>

<style scoped lang="sass">
#menu
  width: 100%
  height: calc(100% - 25px)
  text-align: center
  h1
    font-family: 標楷體
    display: inline-block
    border-bottom: 1px solid black
    color: #f0f
    font-size: 24px
  ul
    list-style: none
    padding: 0
  li
    width: 100%
    height: 40px
    line-height: 40px
    font-size: 16px
    text-align: center
    background-image: url(@/assets/menu1.png)
    background-repeat: no-repeat
    background-position: center

    &:hover
      background-image: url(@/assets/menu2.png)
</style>
