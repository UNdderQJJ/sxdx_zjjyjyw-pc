import request from '@/utils/request'

// 查询工单报表列表
export function listReport(query) {
  return request({
    url: '/admin/report/list',
    method: 'get',
    params: query
  })
}

