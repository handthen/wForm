import Form from './component/form.vue'
import FormItem from './component/formItem.vue'
import './component/form.scss'

function install(vue) {
    vue.component('MForm', Form)
    vue.component('MFormItem', FormItem)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default {
    install
}

export const MForm = Form
export const MFormItem = FormItem
