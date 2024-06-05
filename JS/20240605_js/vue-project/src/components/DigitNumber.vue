<template>
  <!-- 頁面上只能有一個id -->
<svg
version="1.1"
class="number"
xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink"
x="0px"
y="0px"
width="841.89px"
height="595.28px"
viewBox="0 0 841.89 595.28"
enable-background="new 0 0 841.89 595.28"
xml:space="preserve"
>
<rect
id="number-A"
:class="{active:'02356789'.includes(data)}"
x="62.919"
y="95.506"
fill="#E60012"
stroke="#231815"
stroke-miterlimit="10"
width="154.081"
height="9.63"
/>
<rect
id="number-D"
:class="{active:'2345689'.includes(data)}"
x="62.919"
y="253.667"
fill="#E60012"
stroke="#231815"
stroke-miterlimit="10"
width="154.081"
height="9.63"
/>
<rect
id="number-G"
:class="{active:'0235689'.includes(data)}"
x="62.919"
y="410.037"
fill="#E60012"
stroke="#231815"
stroke-miterlimit="10"
width="154.081"
height="9.63"
/>
<rect
id="number-E"
:class="{active:'0268'.includes(data)}"
x="62.919"
y="270.476"
fill="#E60012"
stroke="#231815"
stroke-miterlimit="10"
width="9.63"
height="133.639"
/>
<rect
id="number-F"
:class="{active:'013456789'.includes(data)}"
x="207.37"
y="270.476"
fill="#E60012"
stroke="#231815"
stroke-miterlimit="10"
width="9.63"
height="133.639"
/>
<rect
id="number-B"
:class="{active:'045689'.includes(data)}"
x="62.919"
y="113.143"
fill="#E60012"
stroke="#231815"
stroke-miterlimit="10"
width="9.63"
height="132.081"
/>
<rect
id="number-C"
:class="{active:'01234789'.includes(data)}"
x="207.37"
y="113.143"
fill="#E60012"
stroke="#231815"
stroke-miterlimit="10"
width="9.63"
height="132.081"
/>
</svg>
</template>

<!-- 接受外部傳進來的參數，代表8的svg -->
<script setup>
defineProps(['data'])
</script>

<style scoped lang="sass">
.number
  margin: 10px
rect
  fill: transparent
  &.active
    fill: #E60012
</style>:class="{active:'023456789.includes(data)'}"
