import request from '@/utils/request'

// 查询校园报表列表
export function listRelevancy(query) {
  return request({
    url: '/admin/relevancy/list',
    method: 'get',
    params: query
  })
}

// 查询校园报表详细
export function getRelevancy(deptId) {
  return request({
    url: '/admin/relevancy/' + deptId,
    method: 'get'
  })
}

// 新增校园报表
export function addRelevancy(data) {
  return request({
    url: '/admin/relevancy',
    method: 'post',
    data: data
  })
}

// 修改校园报表
export function updateRelevancy(data) {
  return request({
    url: '/admin/relevancy',
    method: 'put',
    data: data
  })
}

// 删除校园报表
export function delRelevancy(deptId) {
  return request({
    url: '/admin/relevancy/' + deptId,
    method: 'delete'
  })
}
