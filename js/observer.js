class Observe{
  constructor(data){
    this.data = data
    this.ObserveFn(data)
  }
  ObserveFn (data) {
    if(!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(keys => {
      this.defienReactive(data, keys, data[keys])
      // 假如为对象则进行递归继续劫持
      this.ObserveFn(data[keys])
    })
    
  }
  // 先获取到key和value
  defienReactive(data, keys, value) {
    let that  = this
    let dep = new Dep()
    Object.defineProperty(data, keys,{
      enumerable: true,
      configurable: true,
      get () { // 取值时调用的方法
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set (newVal) { // 赋值时调用方法  
        if(newVal !== value) {
          value = newVal
          that.ObserveFn(newVal)
          dep.notify()
        }
      }
    })
  }
}

// 发布订阅模式
class Dep{
  constructor () {
    this.subs = []
  }
  addSub (watcher) {
    this.subs.push(watcher)
  }
  notify () {
    this.subs.forEach(watcher=>watcher.updata())
  }
}