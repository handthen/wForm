import wFormVue from './components/wForm'

function install(vue) {
    vue.component('wForm', wFormVue)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default {
    install
}

export const wForm = wFormVue


