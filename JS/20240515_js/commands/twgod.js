import axios from 'axios'
import { distance } from '../utils/distance.js'
import template from '../templates/taiwangods.js'
import fs from 'node:fs' // node: 內建套件

export default async event => {
  try {
    const { data } = await axios.post('https://taiwangods.moi.gov.tw/Control/SearchDataViewer.ashx?t=landscape', new URLSearchParams({
      lang: 1,
      area: '',
      rtype: '',
      festival: '',
      keyWord: '',
      festival_s: '',
      festival_e: ''
    }))
    // d代表陣列裡每個東西，加上欄位加上 distance 欄位
    const replies = data
      .map(d => {
        d.distance = distance(d.L_MapY, d.L_MapX, event.message.latitude, event.message.longitude)
        return d
      })
    // 排序 距離近的在前 遠的在後
      .sort((a, b) => {
        return a.distance - b.distance
      })
    // 取前五筆資料
      .slice(0, 5)
    // 組成我們要的訊息格式
      .map(d => {
        const t = template()
        t.body.contents[0].text = d.LL_Title
        t.body.contents[1].text = d.LL_Highlights
        t.body.contents[2].contents[0].contents[1].text = d.LL_Country + d.LL_Area + d.LL_Address
        t.body.contents[2].contents[1].contents[1].text = d.LL_OpeningData
        t.body.contents[2].contents[2].contents[1].text = d.LL_OpeningTime
        t.footer.contents[0].action.uri = `https://www.google.com/maps/search/?api=1&query=${d.L_MapY},${d.L_MapX}`
        t.footer.contents[1].action.uri = `https://taiwangods.moi.gov.tw/html/landscape/1_0011.aspx?i=${d.L_ID}`
        return t
      })
    const result = await event.reply({
      type: 'flex',
      altText: '宗教文化查詢結果', // 替代文字
      contents: { // flex訊息 單張卡片可以寫 type bobble 很多張要用type carousel
        type: 'carousel',
        contents: replies//  Flex 訊息的內容，它是一個物件，包含了要顯示的 Flex 卡片的結構和內容
      }
    })
    if (process.env.DEBUG === 'true') {
      console.log(result)
      if (result.message) {
        // writeFileSync 把東西內容寫在指定的檔案裡
        // fs(file system)做檔案處理 讀檔案 寫檔案
        // fs.writeFileSync('要寫入的檔案',JSON.stringify(replies陣列, null不使用取代功能,做兩個空白縮排))
        fs.writeFileSync('./dump/twgod.json', JSON.stringify(replies, null, 2))
      }
    }
  } catch (error) {
    console.log(error)
    event.reply('發生錯誤')
  }
}
