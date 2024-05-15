import 'dotenv/config'
import linebot from 'linebot'
import commandFE from './commands/fe.js'
import commandTWGod from './commands/twgod.js'
import commandUsd from './commands/usd.js'
import { scheduleJob } from 'node-schedule'
import * as usdtwd from './data/usdtwd.js'

// 早上五點執行更新的function 更新匯率
scheduleJob('0 5 * * *', () => {
  usdtwd.update()
})
usdtwd.update() // 確定剛打開的時候會執行update 這個function

// 抓eve檔案的資訊
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', event => { // 監聽機器人接收到的訊息事件
  if (process.env.DEBUG === 'true') { // 檢查環境變數 DEBUG 是否被設置為 'true'，如果是的話，則將事件物件輸出到控制台
    console.log(event)
  }
  if (event.message.type === 'text') { // 檢查接收到的訊息是否為文字類型
    if (event.message.text === '前端') { // 檢查訊息的文字內容是否為 '前端'
      // 前端查詢指令拆出去寫commands>fe.js
      commandFE(event)
    } else if (event.message.text === 'usd') {
      commandUsd(event)
    } else if (event.message.text === 'qr') {
      event.reply({
        type: 'text',
        text: '123',
        quickReply: {
          items: [
            // 回給我按鈕，按下去是使用者傳訊息
            // 設計一套查詢的流程
            {
              type: 'action',
              action: {
                type: 'message',
                text: 'ubike:taipei', // 按下去，使用者會傳出來的文字
                label: 'taipei' // 按鈕文字
              }
            },
            {
              // 打開一個網頁
              type: 'action',
              action: {
                type: 'uri',
                uri: 'https://wdaweb.github.io',
                label: '職訓'
              }
            },
            {
              // 讓使用者傳訊息，但不顯示在聊天室(會送出去，但不在聊天室留紀錄)
              type: 'action',
              action: {
                type: 'postback',
                label: 'postback',
                data: 'aaa'
              }
            }
          ]
        }
      })
    }
  } else if (event.message.type === 'location') {
    commandTWGod(event)
  }
})
bot.on('postback', event => {
  console.log(event)
  event.reply('aaa')
})

bot.listen('/', process.env.PORT || 3000, () => { // 監聽指定端口的函式調用
  console.log('機器人啟動')
})
