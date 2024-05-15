import axios from 'axios'
import * as cheerio from 'cheerio'// 導入 Cheerio 套件

export default async (event) => {
  try {
    const { data } = await axios.get('https://wdaweb.github.io/')
    const $ = cheerio.load(data)
    const courses = [] // 空陣列，用於存儲抓取到的資料
    // 先找到要抓的資料的id
    $('#fe .card-title').each(function () {
      courses.push($(this).text().trim())// 將每個選中元素的文字內容加到陣列 // trim移除前後空白/縮排
    })
    const result = await event.reply(courses)// 將抓取到的課程資料作為參數回覆給事件物件
    if (process.env.DEBUG === 'true') {
      console.log(result)
    }
  } catch (error) {
    console.log(error)
    event.reply('發生錯誤')// event.reply只能用一次 //在發生異常時，將錯誤訊息輸出到控制台
  }
}
