import httpRequest from '@/utils/request';

export function uploadFile(formdata) {
    return httpRequest({
        headers: {'Content-Type': 'multipart/form-data'},
        processData:false,
        url: '/upload',
        method: 'post',
        data: formdata
    })
}