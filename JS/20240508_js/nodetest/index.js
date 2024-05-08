// 將 a.js 的 export default 引用進來，取名為a
// import 變數 from 來源
// import 一定要在最上面

// 引用檔案必須要是 ./，若沒加 ./ 代表套件
// from 'a.js'   ---> 引用 a.js 套件
// from './a.js' ---> 引用 a.js 檔案
import a from './a.js' // 引用檔案取名為a，此時兩個檔案引進的值已分開

import * as b from './b.js' // 一次引用所有 export，取名為 b
import { b1, b2, b3 } from './b.js' // 只引用 b1、b2、b3，若此檔案剛好有b1，會衝突，解法↓
import { b1 as bb1 } from './b.js' // 只引用 b1，用 as 重命名為 bb1

// 引用 export default 取名為 c
// 引用所有 export 取名為 cc
import c, * as cc from './c.js'
// 只取 export c1 重命名為 cc1
import { c1 as cc1 } from './c.js'

console.log('index - a.a1: ' + a.a1)
console.log('index - a.add: ' + a.add()) //6 (1+2+3)
// 不能透過 = 來改原檔案的值
a.a1 = 100 // pass by value
a.a2 = 100 // pass by value
// a.a3 = 100
a.test(500) // 在原檔寫function來改值，並呼叫function pass by value
a.a4.push(300) // 陣列pass by reference (a4變100,200,300)
console.log('index - a.a1: ' + a.a1) // 100 (index.js 12)
console.log('index - a.a2: ' + a.a2) // 100  (index.js 13)
console.log('index - a.a3: ' + a.a3) // 3 引進時的值
console.log('index - a.a4: ' + a.a4) // 100,200,300
a.log()

console.log('index - b.b1: ' + b.b1) // 1
console.log('index - b1: ' + b1) // 1
console.log('index - bb1: ' + bb1) // 1

//具名引用進來的會是 Readonly，不能用 = 換掉
// TypeError: Cannot assign to read only property 'b1' of object '[object Module]'
// b.b1 = 100 // 錯誤，不能直接改

// 單獨引用的會是 const，不能用 = 換掉
// TypeError: Assignment to constant variable.
// b1 = 100
// b3 = 100

b.test(500) // 直接把變數拿進來，變 read only
b.b4.push(300)
console.log('index - b.b3: ' + b.b3) // 500
console.log('index - b.b4: ' + b.b4) // 100,200,300
b.log()

console.log('index - c.c3: ' + c.c3) // 3
console.log('index - cc.c1: ' + cc.c1) // 1
