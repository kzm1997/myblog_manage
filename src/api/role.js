import httpRequest from '@/utils/request';

export function roleList() {
    return httpRequest({
        method:'get',
        url:'/manage/role/select'
    })
}

export function rolePage(query) {
    return httpRequest({
        method:'get',
        url:'/manage/role/list',
        params:{
            pageSize:query.pageSize,
            pageNum:query.pageNum
        }
    })
}