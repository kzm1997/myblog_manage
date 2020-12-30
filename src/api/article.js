import httpRequest from '@/utils/request';

export function getAll(data) {
    return httpRequest({
        method: 'get',
        url: '/manage/article/list',
        params: {
            id: data.id,
            nickname: data.nickname,
            pageNum:data.pageNum,
            pageSize:data.pageSize
        }
    })
}
export function recommend(id,type) {
  return httpRequest({
      method:'get',
      url:'/manage/article/recommend',
      params:{
          id:id,
          type:type
      }
  })
}

export function deleteArticle(id) {
   return httpRequest({
       method:'get',
       url:'/manage/article/delete',
       params:{
           id:id
       }
   })
}

export function publish(id) {
   return httpRequest({
       method:'get',
       url:'/manage/article/publish',
       params:{
           id:id
       }
   })
}