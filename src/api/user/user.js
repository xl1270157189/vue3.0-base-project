import CONSTANT from '../../utils/const_var'
import http from '../../utils/http'

export default {

  // 获取用户列表
  getUserData(data, params) {
    return http.request('/employee/list', data, params, CONSTANT.POST)
  },

}
