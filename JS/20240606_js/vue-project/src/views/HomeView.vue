<template lang="pug">
//- 引入圖片img('')
p {{ $route.name }}
p {{ $route.path }}
p {{ $route.fullPath }}
p {{ $route.meta.title }}
//- $route顯示路由的資訊   $router對路由做操作
img(src="@/assets/national_park.jpg" @click="$router.push('/yangmingshan')")
//- img(src="@/assets/national_park.jpg" @click="$router.push({ name: 'home' })")
</template>

<script>

</script>
