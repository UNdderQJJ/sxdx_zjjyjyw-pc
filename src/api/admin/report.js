import request from '@/utils/request'

// 查询工单报表列表
export function listReport(query) {
  return request({
    url: '/admin/info/list',
    method: 'get',
    params: query
  })
}

// 查询工单报表详细
export function getReport(orderId) {
  return request({
    url: '/admin/info/' + orderId,
    method: 'get'
  })
}

// 新增工单报表
export function addReport(data) {
  return request({
    url: '/admin/info',
    method: 'post',
    data: data
  })
}

// 修改工单报表
export function updateReport(data) {
  return request({
    url: '/admin/info',
    method: 'put',
    data: data
  })
}

// 删除工单报表
export function delReport(orderId) {
  return request({
    url: '/admin/info/' + orderId,
    method: 'delete'
  })
}
