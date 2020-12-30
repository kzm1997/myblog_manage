import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import Moment from 'moment'
import { messages } from './components/common/i18n';
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './assets/icon/iconfont.css';
import './components/common/directives';
import 'babel-polyfill';
import db from '@/utils/localstorage'
import store from './store'
Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

Vue.use({
    install (Vue) {
        Vue.prototype.$db = db
    }
})

//定义时间全局过滤器
Vue.filter('convertDate', function (value) {
    return Moment(value).format('YYYY-MM-DD');
})
Vue.filter('convertDatezhun', function (value) {
    return Moment(value).format('YYYY-MM-DD HH:mm:ss');
})

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app');
