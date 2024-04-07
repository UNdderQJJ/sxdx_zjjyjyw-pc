import request from '@/utils/request'

// 查询工单记录列表
export function listInfo(query) {
  return request({
    url: '/admin/info/list',
    method: 'get',
    params: query
  })
}

// 查询工单记录详细
export function getInfo(orderId) {
  return request({
    url: '/admin/info/' + orderId,
    method: 'get'
  })
}

// 新增工单记录
export function addInfo(data) {
  return request({
    url: '/admin/info',
    method: 'post',
    data: data
  })
}

// 修改工单记录
export function updateInfo(data) {
  return request({
    url: '/admin/info',
    method: 'put',
    data: data
  })
}

// 删除工单记录
export function delInfo(orderId) {
  return request({
    url: '/admin/info/' + orderId,
    method: 'delete'
  })
}

export function orderFlow(data) {
  return request({
    url: '/admin/info/flow',
    method: 'post',
    data: data
  })
}

//获取该人员关联信息
export function getUserInfo(userName) {
  return request({
    url: '/zjzyjyw/getInformation?userName=' + userName,
    method: 'put'
  })
}
