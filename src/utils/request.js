import axios from 'axios';
import {Message} from 'element-ui'
import db from '../utils/localstorage'
import store from '../store'
import moment from 'moment'

moment.locale('zh-cn')


let httpRequest = axios.create({
    baseURL: 'http://localhost:8098/kblog',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})

/*httpRequest.interceptors.request.use(
    config => {
        let expireTime = store.getters.expireTime;
        let now = moment().format('YYYYMMDDHHmmss');
        // 让token早10秒种过期，提升“请重新登录”弹窗体验
        if (now - expireTime > -10) {
            this.$confirm('很抱歉，登录已过期，请重新登录', '登录已过期', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                db.clear()
                location.reload()
            })
        }
        //带上token
        if (store.state.user.token) {
            config.headers['Authentication'] = store.state.account.token
        }
        return config;
    },
    (error => {
        Promise.reject(error)
    })
)

const errorHandle = (status, other) => {
    switch (status) {
        case 400:
            Message({
                type: 'warning',
                message: other
            })
            break;
        case 401:
            //todo 登录
            break;
        case 500:
            Message({
                type: 'warning',
                message: other
            })
            break;
        default:
            console.log(other);
    }
}
httpRequest.interceptors.response.use(
    //请求成功
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
    //请求失败
    error => {
        const {response} = error;
        if (response) {
            //不是200的情况
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        }
    }
)*/

export default httpRequest