// then 方法未实现
const Promise  = require('./index.js')
console.log(1)
new Promise((resolve, reject) => {
	console.log(`测试成功`)
	console.log(2)
	resolve(3)
}).then(res=>{
	console.log(res)
})