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
        console.log(this.EventMap)
    }
    emit(eventName, ...arg) {
        console.log(this.EventMap)
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
            EventList.splict(EventList.findIndex(v => v == callback), 1)
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
                pName = parent.$options.name
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(arg))
            }
        }
    }
}