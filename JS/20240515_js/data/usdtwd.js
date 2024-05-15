import axios from 'axios'

export let exrate = 32 // 設定匯率32

// 更新function 向https://tw.rter.info/howto_currencyapi.php發請求
export const update = async () => {
  try {
    const { data } = await axios.get('https://tw.rter.info/capi.php')
    exrate = data.USDTWD.Exrate // 把得到的匯率更新到變數裡面
  } catch (error) {
    console.log(error)
  }
}
