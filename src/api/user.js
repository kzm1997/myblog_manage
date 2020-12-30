import httpRequest from '@/utils/request';

export function dologin(data) {
    return httpRequest({
        method: 'post',
        url: '/loginback/login',
        data: data
    })
}

export function getIndex() {
    return httpRequest({
        method: 'get',
        url: '/loginback/index'
    })
}

export function getUser(data) {
    return httpRequest({
        method: 'get',
        url: '/manage/user/frontView',
        params: data
    })
}

export function forbid(id, type) {
    return httpRequest({
        method: 'get',
        url: '/manage/user/forbid',
        params: {
            id: id,
            type: type
        }
    })
}

export function getBackUser(data) {
    return httpRequest({
        method: 'get',
        url: '/manage/user/backView',
        params: data
    })
}

export function addUser(data) {
   return httpRequest({
       method:'post',
       url:'/manage/user/add',
       data:data
   })
}

export function editUser(data) {
    return httpRequest({
        method:'post',
        url:'/manage/user/edit',
        data:data
    })
}