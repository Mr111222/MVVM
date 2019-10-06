class Mvvm{
	constructor(options) {
		this.$el = options.el
		this.$data = options.data
		if(this.$el) {
			// 数据劫持
			new Observe(this.$data)
			new Compile(this.$el, this)
			this.proxyData(this.$data)
		}
	}
	// 进行代理,注意这时候的Object.defineProperty 把属性定义到this身上，不是data上面了
	proxyData (data) {
		Object.keys(data).forEach(keys => {
			Object.defineProperty(this, keys, {
				get () {
					return data[keys]
				},
				set (newVal) {
					data[keys] = newVal
				}
			})
		})
	}
	
}