export default{
   methods:{
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