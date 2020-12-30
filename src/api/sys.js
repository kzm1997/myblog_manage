import httpRequest from '@/utils/request';

export function categoryPie() {
   return httpRequest({
       method:'get',
       url:'/manage/sys/category'
   })
}
export function commentLine() {
    return httpRequest({
        method:'get',
        url:'/manage/sys/comment'
    })
}