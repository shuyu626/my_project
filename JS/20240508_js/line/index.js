import 'dotenv/config'
import linebot from 'linebot' // 把套件拉進來
import axios from 'axios' // 把套件拉進來

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async (event) => {
  console.log(event)
  if (event.message.type !== 'text') return

  try {
    // event.reply() 回復訊息
    // const result = await event.reply(event.message.text) // 使用者打什麼機器人就回什麼
    // console.log(result)
    const { data } = await axios.get(
      'https://data.moenv.gov.tw/api/v2/gp_p_01?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=ImportDate%20desc&format=JSON'
    )
    for (const record of data.records) {
      if (record.storeno === event.message.text) {
        // 輸入的
        const result = await event.reply([record.storename, record.storeaddr, record.contacttel])
        console.log(result)
        break // 找到就停下來，否則會跑完所有的資料
      }
    }
  } catch (error) {
    console.log(error)
  }
})

bot.listen('/', 3000, () => {
  console.log('機器人啟動')
})

// bot.listen('/aaaa', 3000) 打這樣的話 機器人會在 http://localhost:3000/aaaa
