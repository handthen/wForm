class Emitter {
  constructor() {
    this.EventMap = new Map()
  }
  on(eventName, callback) {
    if (this.EventMap.has(eventName)) {
      const EventList = this.EventMap.get(eventName)
      EventList.push(callback)
      return this.EventMap.set(eventName, EventList)
    }
    const EventList = [callback]
    this.EventMap.set(eventName, EventList)
  }
  once(eventName, callback) {
    const fn = () => {
      callback && callback()
      this.off(eventName, fn)
    }
    this.on(eventName, fn)
    console.log(this.EventMap,"this.EventMap")
  }
  emit(eventName, ...arg) {
    if (this.EventMap.has(eventName)) {
      const EventList = this.EventMap.get(eventName)
      EventList.forEach(v => {
        v.apply(null, arg)
      })
    }
  }
  off(eventName, callback) {
    if (this.EventMap.has(eventName)) {
      const EventList = this.EventMap.get(eventName)
      EventList.splice(EventList.findIndex(v => v == callback), 1)
      console.log(EventList,'off')
      this.EventMap.set(eventName, EventList)
    }
  }
}
export const $bus = new Emitter()

export default {
  methods: {
    $dispatch(componentName, eventName, ...arg) {
      let parent = this.$parent || this.$root
      let pName = parent && parent.$options.name
      while (parent && pName != componentName) {
        parent = parent.$parent
        pName = parent && parent.$options.name
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(arg))
      }
    },
    $clone(target) {
      const isArr = Array.isArray(target) ? 1 : 0
      target = isArr ? target : [target]
      const clone = []
      for (var i = 0; i < target.length; i++) {
        let obj = {}
        let currentTarget = target[i]
        Object.keys(currentTarget).forEach(key => {
          if (typeof currentTarget[key] == 'object') {
            obj[key] = this.$clone(currentTarget[key])
          } else {
            obj[key] = currentTarget[key]
          }
        })
        clone.push(obj)
      }
      return isArr ? clone : clone[0]
    }
  }
}