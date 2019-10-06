class Compile{
	constructor (el, vm) {
		this.vm = vm
		this.el = this.isElement(el) ? el : document.querySelector(el)
		if(this.el) {
			// 将文档节点放到fragment中,转到内存中，进行处理
			let fragment = this.node2fragmen(this.el)
			// 编译原文档， 提取想要的元素节点v-model和文本节点{{a}}
			this.Compile(fragment)
			// push 到元文档中
			this.el.appendChild(fragment)
		}
	}
	// 工具函数
	isElement (node) {
		return node.nodeType === 1
	}
	isDirective(node){
		return node.includes('v-')
	}
	// 核心方法
	node2fragmen (node) {
		let fragment = document.createDocumentFragment()
		let firstChild
		while(firstChild = node.firstChild) {
			fragment.appendChild(firstChild)
		}
		return fragment
	}
	// 编译模板
	Compile(fragment) {
		let childNodes = fragment.childNodes
		Array.from(childNodes).forEach(node => {
			if (this.isElement(node)) {
				this.compileElement(node)
				this.Compile(node)
			} else {
				this.compileText(node)
			}
		})
	}
	compileElement (node) {
		// 取出当前节点的属性
		Array.from(node.attributes).forEach(res => {
			let expr = res.value
			// 判断属性名字是否包含v-
			if(this.isDirective(res.name)) {
				let [, type] = res.name.split('-')
				CompileUtil[type](node, this.vm, expr)
			}
		})
	}
	compileText (node) {
		let expr = node.textContent // 取出文本框的内容
		let reg = /\{\{([^}]+)\}\}/g // {{a}} {{b}} {{v}}
		if (reg.test(expr)) {
			CompileUtil['text'](node, this.vm, expr)
		}
	}
}

// 工具方法
CompileUtil = {
	// 获取val数值
	getVal (vm, expr) {
		expr = 	expr.split('.') //msg.a   detail.b   所以用  . 进行分割
		// 获取实例上对应的数据
		return expr.reduce((prev, next)=> {
			return prev[next]
		}, vm.$data)
	},
	// 获取文本的数值
	getTextVal(vm, expr){
		return expr.replace(/\{\{([^}]+)\}\}/g, (...arg) => {
			return this.getVal(vm, arg[1])
		})
	},
	setVal (vm, expr, value) {
		expr = expr.split('.')
		return expr.reduce((prev, next, currentIndex) => {
			if(currentIndex === expr.length - 1) {
				return prev[next] = value
			}
			return prev[next]
		}, vm.$data)
	},
	// 输入框处理
	model (node, vm, expr) {
		let updaterFn = this.updater['modelUpdater']
		// 添加监控，数据变化了调用watch的callback
		// 当值变化后，会将新值newVal传递过去
		new Watcher(vm, expr, (newVal) => {
			updaterFn && updaterFn(node, this.getVal(vm, expr))
		})
		updaterFn && updaterFn(node, this.getVal(vm, expr))

		node.addEventListener('input',(e)=>{
			this.setVal(vm, expr, e.target.value)
		})
	},
	// 文本处理
	text (node, vm, expr) {
		let updaterFn = this.updater['textUpdater']
		// 针对某个节点分别进行watch监控
		expr.replace(/\{\{([^}]+)\}\}/g, (...arg)=>{
			new Watcher(vm, arg[1], (newVal) => {
				// 重新赋值进行更新
				updaterFn && updaterFn(node, this.getTextVal(vm, expr))
			})
		})
		updaterFn && updaterFn(node, this.getTextVal(vm, expr))
	},
	updater: {
		// 文本更新
		textUpdater (node, value) {
			node.textContent = value
		},
		// 输入框更新
		modelUpdater (node, value) {
			node.value = value
		}
	} 
}