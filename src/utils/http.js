import axios from 'axios'
import globalMethods from './global-methods'
import Config from '../config/index'
import CONSTANT from './const_var'
import store from '../store'
import Storage from './storage'
import { Loading } from 'element-ui';
import qs from 'qs'  // 序列化字符串

var loadingInstance = null;

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? Config.PRODUCT_API_URL : Config.API_URL,
    timeout: 600000, // 请求超时时间
});



// 拆分数据
function splitData(data) {
    let url = '';
    for (let k in data) {
        if (data.hasOwnProperty(k)) {
            let value = data[k] || ''
            url = url + '&' + k + '=' + encodeURIComponent(value)
        }
    }
    return url ? url.substring(1) : ''
}

// 拼接参数
function contractUrl (url, data) {
    let version = Config.API_VERSION;
    return  version + url + (url.indexOf('?') < 0 ? '?' : '&') + splitData(data)
}

// request 拦截器
instance.interceptors.request.use(
    (config) => {
        if (Storage.get('token')) {
            config.headers['token'] = Storage.get('token')
        }
        if (sessionStorage.getItem('setUserId')) {
            config.headers['uuid'] = sessionStorage.getItem('setUserId')
        }
         config.headers['timetamp'] = (new Date()).getTime()
        
        return config
    },
    error => Promise.reject(error),
)

// respone 拦截器
instance.interceptors.response.use(
    // 响应正常的处理
    (response) => {
        const { data } = response
        if (response.status !== 200) {
            globalMethods.$warning(response.statusText)
            if (data.code === '000000') {
                // 接口自定义错误代码
                // 移除登陆token 显示接口错误消息
            }
            return Promise.reject(data)
        }
        if (data === null) {
            return Promise.resolve({
                code: '009900',
                msg: '系统出现错误',
                data: {},
            })
        }
        if (data.code === undefined) {
            if (data.msg !== undefined) {
                return Promise.resolve({
                    code: '009900',
                    msg: data.msg,
                    data: null,
                })
            }
            return Promise.resolve({
                code: '009900',
                msg: data.message !== null ? data.message : '',
                data: null,
            })
        }
        if (loadingInstance != null) {
            loadingInstance.close();
        }
        return Promise.resolve(data)
    },
    // 请求出错的处理
    (error) => {
        console.log(error);
        if (loadingInstance != null) {
            loadingInstance.close();
        }
        if (error.response === undefined && error.status === undefined) {
            return Promise.resolve({
                code: '009900',
                msg: '服务器响应超时',
                data: null,
            })
        }
        if (error.response.status >= 500) {
            return Promise.resolve({
                code: '009900',
                msg: '服务器出现错误',
                data: null,
            })
        }
        if (error.response.status === 401) {
            return Promise.resolve({
                code: '009900',
                msg: '用户名或密码不正确',
                data: null,
            })
        }
        const { data } = error.response
        if (data.code !== undefined) {
            return Promise.resolve({
                code: data.code,
                msg: data.msg,
            })
        }
        return Promise.resolve({
            code: '009900',
            msg: data.msg,
            data: null,
        })
    },
)


/**
 * @apiDescription 封装的网络请求方法
 * @apiGroup
 * @apiName request
 * @apiParam  url 地址
 * @apiParam  data 请求数据
 * @apiParam  params 请求参数
 * @apiParam  method 方法类型：get或者post
 * @apiParam  version 接口版本号
 * @apiParamExample
 *       request('Appointment/appointmentList', data, params, CONSTANT.GET)
 * @apiReturn Promise
 */
async function request(url, data = {}, params = {}, method = CONSTANT.POST, version = Config.API_VERSION) {
    loadingInstance = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    if (method === CONSTANT.POST) {
        // data.userId = store.state.user.userInfo === null ? '' : store.state.user.userInfo.id;
        data = qs.stringify(data);
    } else {
        params.userId = store.state.user.userInfo === null ? '' : store.state.user.userInfo.id
    }
    return instance({
        url: version + url,
        method,
        data,
        params,
    })
}

async function requestNotLoad(url, data = {}, params = {}, method = CONSTANT.POST, version = Config.API_VERSION) {
    if (method === CONSTANT.POST) {
        // data.userId = store.state.user.userInfo === null ? '' : store.state.user.userInfo.id;
        data = qs.stringify(data);
    } else {
        params.userId = store.state.user.userInfo === null ? '' : store.state.user.userInfo.id
    }
    return instance({
        url: version + url,
        method,
        data,
        params,
    })
}

/**
 * 导出excel文件  (get)
 * @param url 下载地址
 * @param data 下载参数
 * @returns {Promise.<void>}
 */
async function exportGet(url, data) {
    window.open(contractUrl(url, data))
}
// 判断浏览器类型
function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if (userAgent.indexOf("OPR") > -1) {
      return "Opera";
    }; //判断是否Opera浏览器 OPR/43.0.2442.991
    if (userAgent.indexOf("Firefox") > -1) {
      return "FF";
    } //判断是否Firefox浏览器  Firefox/51.0
    if (userAgent.indexOf("Trident") > -1) {
      return "IE";
    } //判断是否IE浏览器  Trident/7.0; rv:11.0
    if (userAgent.indexOf("Edge") > -1) {
      return "Edge";
    } //判断是否Edge浏览器  Edge/14.14393
    if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    } // Chrome/56.0.2924.87
    if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    } //判断是否Safari浏览器 AppleWebKit/534.57.2 Version/5.1.7 Safari/534.57.2
  }
function exportPost (url, data, name) {
    let loadingInstance = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    axios.post('/faims'+url, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', //请求的数据类型为form data格式
        'uuid'  :Storage.get('setUserId'),
        'timetamp' :(new Date()).getTime(),
        'token':Storage.get('token')
      },
      'responseType':'blob'  //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
    }).then(function (response) {
      console.log(response)
      // 下载sss
      if (myBrowser() == 'IE') {
        const blob = new Blob([response.data]);
        window.navigator.msSaveBlob(blob, name+'.xls');
      } else {
        const blob = new Blob([response.data]);
        
        const fileName = name+'.xls';
        const linkNode = document.createElement('a');

        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = 'none';
        linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click();  //模拟在按钮上的一次鼠标单击

        URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
      }
      loadingInstance.close();
    }).catch(function (error) {
      loadingInstance.close();
      console.log(error);
    });
  }


/**
 * 封装post请求 FormData方式 (上传文件)
 * @param url
 * @param params
 * @returns {Promise}
 */

async function postForm(url, params = {}) {
    loadingInstance = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    return instance.post(Config.API_VERSION + url, params)
}


export default {
    request,
    exportGet,
    exportPost,
    postForm,
    requestNotLoad
}
