<script>
export default {
    name: 'WCol',
    props: {
        span: {
            type:[String,Number],
            default:0
        },
        offset: {
            type: Number,
            default: 0
        },
        tag:{
            type:String,
            default:'div'
        }
    },
    computed: {
        colStyle() {
            let parent = this.$parent;
            while (parent && parent.$options.name !== 'WRow') {
                parent = parent.$parent;
            }
            const gutter = parent.gutter
            return {
                boxSizing: 'border-sizing',
                marginLeft: this.offset ? `calc(100% / 24 * ${this.offset})` : "",
                paddingLeft: gutter ? gutter / 2 + 'px' : "",
                paddingRight: gutter ? gutter / 2 + 'px' : ''
            }
        },
        colClass() {
            return 'w-col-' + this.span
        }
    },
    render(h){
        return h(this.tag,{
            class:[this.colClass],
            style:this.colStyle
        },this.$slots.default)
    }
}
</script>
<style scoped lang="scss">
@for $i from 1 through 24 {
    .w-col-#{$i} {
        flex: calc(100% / 24 * #{$i});
        max-width: calc(100% / 24 * #{$i});
    }
}
</style>