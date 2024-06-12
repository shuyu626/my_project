<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">鈴聲設定</h1>
      </v-col>
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>試聽</th>
              <th>選擇</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alarm in alarms" :key="alarm.id">
              <td>{{ alarm.name }}</td>
              <td>
                <audio :src="alarm.file" controls></audio>
              </td>
              <td>
                <v-radio-group v-model="selectedAlarm">
                  <v-radio :value="alarm.id"></v-radio>
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { definePage } from 'vue-router/auto'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

definePage({
  meta: {
    title: '番茄鐘 | 設定'
  }
})

// 語法風格 要在 use 一次
const settings = useSettingsStore()
// 想解構，可用storeToRefs 來保持響應性

const { alarms, selectedAlarm } = storeToRefs(settings)
</script>

<!-- scoped 只影響這個元件，對深層元件無法修改，所以用 deep(可以選到深層元件) -->
<style scoped lang="scss">
:deep(.v-input__details) {
  display: none;
}
</style>
