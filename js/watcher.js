// 观察这模式， 数据变化后执行对应的方法
// 用新值和老值进行比对，不同则增加一个watcher, 并且调用回调函数 callback
class Watcher{
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    // 获取老值
    this.oldVal = this.getOld()
  }
  // 获取老值 然后和新值进行比对
  getVal(vm, expr) {
    expr = expr.split('.')
    return expr.reduce((prev, next)=>{
      return prev[next]
    }, vm.$data)
  }
  getOld () {
    Dep.target = this
    let val = this.getVal (this.vm, this.expr)
    // Dep.target = null
    return val
  } 
  // 对比之后调用更新 
  updata () {
    let newval = this.getVal (this.vm, this.expr)
    let oldVal = this.oldVal
    if(newval !== oldVal) {
      this.cb(newval)
    }
  }
}