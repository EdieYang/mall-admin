import request from '@/plugin/axios'

export function uploadImage (data) {
  return request({
    url: 'https://www.linchongpets.com/lpCmsTest/oss/image',
    method: 'post',
    headers: { 'Content-type': 'multipart/form-data' },
    params: data
  })
}

