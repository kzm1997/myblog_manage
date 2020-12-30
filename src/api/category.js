import httpRequest from '@/utils/request';

export function getCategory() {
    return httpRequest({
        method: 'get',
        url: '/category/getAllCategory'
    })
}

export function tagByCategory(id) {
    return httpRequest({
        method: 'get',
        url: '/category/tagByCategory',
        params: {
            categoryId: id
        }
    })
}

export function getCategoryList(query) {
    return httpRequest({
        method: 'get',
        url: '/manage/category/list',
        params: {
            id: query.id,
            pageNum: query.pageNum,
            pageSize: query.pageSize
        }
    })
}

export function categoryEdit(data) {
    return httpRequest({
        method: 'post',
        url: '/manage/category/edit',
        data: data
    })
}

export function categoryAdd(data) {
    return httpRequest({
        method:'post',
        url:'/manage/category/add',
        data:data
    })
}

export function deleteCatgeory(id) {
   return httpRequest({
       method:'get',
       url:'/manage/category/delete',
       params:{
           id:id
       }
   })
}