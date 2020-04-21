import httpRequest from '@/utils/request';

export function dologin(data) {
   return httpRequest({
       method:'post',
       url:'/loginback/login',
       data:data
   })
}
export function getIndex() {
    return httpRequest({
       method:'get',
       url:'/loginback/index'
    })
}

export function getUser(data) {
   return httpRequest({
       method:'get',
       url:'/manage/user/frontView',
       data:data
   })
}