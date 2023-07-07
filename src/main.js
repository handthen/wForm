import wFormVue from './components/wForm'

function install(vue) {
    vue.component('wFormHand', wFormVue)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default {
    install
}

export const wFormHand = wFormVue


