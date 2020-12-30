import httpRequest from '@/utils/request';


export function getArticle(query) {
    return httpRequest({
        method: 'get',
        url: '/manage/comment/list',
        params: {
            id: query.id,
            pageNum: query.pageNum,
            pageSize: query.pageSize
        }
    })
}

export function commentView(query) {
    return httpRequest({
        method: 'get',
        url: '/manage/comment/view',
        params: {
            id: query.id,
            pageNum: query.pageNum,
            pageSize: query.pageSize
        }
    })
}

export function deleteComment(id) {
    return httpRequest({
        method:'get',
        url:'/manage/comment/delete',
        params:{
            id:id
        }
    })
}