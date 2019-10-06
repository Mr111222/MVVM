class Promise {
	constructor (excutor) {
		if(typeof excutor !== 'function') {
			throw Error(`Promise ${excutor} is not a function`)
			return false
		}
		this.initVal()
		this.bindThisFn()
		try{
			excutor(this.resolve, this.reject)
		}catch(e){
			this.reject(e)
		}
	}

	initVal () {
		// 初始化
		debugger
		this.value = null
		this.reason = null
		this.state = Promise.PENDING
		this.onFulfilledCallArr = []
		this.onRejectCallArr = []
	}
	// 改变this指向问题
	bindThisFn () {
		this.resolve = this.resolve.bind(this)
		this.reject = this.reject.bind(this)
	}

	// 注意this的指向，或者用that代替
	resolve (value) {
		if(this.state === Promise.PENDING) {
			this.state = Promise.FULFILLED
			this.value  = value
			this.onFulfilledCallArr.forEach(fn => {fn(this.value)})
		}
	}
	reject (reason) {
		if(this.state === Promise.PENDING) {
			this.state = Promise.REJECTED
			this.reason = reason
			this.onRejectCallArr.forEach(fn => {fn(this.reason)})
		}
	}

	// then 方法
	then (onFulfilled, onReject) {
		// 参数检验
		if(typeof onFulfilled !== 'function') {
			onFulfilled = function(value) {
				return value
			}
		}
		if(typeof onReject !== 'function') {
			onReject = function(reason) {
				throw reason
			}
		}
		if(this.state === Promise.FULFILLED) {
			setTimeout(() => {
				onFulfilled(this.value)	
			});
		}
		if(this.state === Promise.REJECTED) {
			setTimeout(() => {
				onReject(this.reason)
			});
		}

		if(this.state = Promise.PENDING) {
			this.onFulfilledCallArr.push(value => {
				onFulfilled(value)
			})
			this.onRejectCallArr.push(reason => {
				onFulfilled(reason)
			})
		}
	}

}




Promise.PENDING = 'pending'
Promise.FULFILLED = 'fulfilled'
Promise.REJECTED = 'rejected'











module.exports = Promise