// 類似function return，一個檔案只能有一個
// 後面只能接一個東西，若要匯出多個要用{}
// 可以匯出function
const a1 = 1
const a2 = 2
let a3 = 3
const a4 = [100, 200]
const add = () => {
	return a1 + a2 + a3
}
const log = () => {
	console.log('a.js a1: ' + a1) // 1
	console.log('a.js a2: ' + a2) // 2
	console.log('a.js a3: ' + a3) // 500 (index.js 第15行)
	console.log('a.js a4: ' + a4) // 100,200,300
}
const test = (value) => {
	a3 = value
}

// export default（預設匯出）
export default {
	a1,
	a2,
	a3,
	a4,
	add,
	log,
	test
}
