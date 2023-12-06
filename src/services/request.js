// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
        /* config 为默认全局配置*/
        //域名前缀

        // 如果为H5模式下可以仅配置前缀然后用反向代理来执行域名配置 (下面的注释是条件编译不要删除)!!!!
        // #ifdef H5
        config.baseURL = process.env.VUE_APP_API + process.env.VUE_APP_API_PREFIX;
        // #endif

        // 如果为小程序模式，需配置完整域名路径 (下面的注释是条件编译不要删除)!!!!
        // #ifdef MP-WEIXIN || APP-PLUS
        config.baseURL = process.env.VUE_APP_API + process.env.VUE_APP_API_PREFIX;
        // #endif

        //请求头
        config.header = {
            'X-Requested-With': 'XMLHttpRequest'
        }

        return config
    })

    // 请求拦截
    uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
        // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
        config.data = config.data || {}
        config.params = config.params||{}
        config.params['token'] = uni.getStorageSync('token')
        // 根据custom参数中配置的是否需要token，添加对应的请求头
        // if(config?.custom?.auth) {
        // 	// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
        // 	config.header.token = vm.$store.state.userInfo.token
        // }
        return config
    }, config => { // 可使用async await 做异步操作
        return Promise.reject(config)
    })

    // 响应拦截
    uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
        console.log("响应拦截");
        if (response.data.code) {
            return response.data;
        }
        console.log("处理错误",response.data)
        uni.$u.toast(response.data.msg)
        return Promise.reject(response.data);
    }, (err) => {
        console.log("错误",err)
        if (err && err.statusCode) {
            switch (err.statusCode) {
                case 400:
                    err.message = '错误请求'
                    break;
                case 401:
                    err.message = '请登录'
                    console.log(123222)
                    uni.$u.toast(err.msg)
                    uni.$u.route({url: 'pages/business/login'})
                    return new Promise(resolve => {})
                case 403:
                    err.message = '拒绝访问'
                    break;
                case 404:
                    err.message = '请求错误,未找到该资源'
                    break;
                case 405:
                    err.message = '请求方法未允许'
                    break;
                case 408:
                    err.message = '请求超时'
                    break;
                case 500:
                    err.message = '服务器端出错'
                    break;
                case 501:
                    err.message = '网络未实现'
                    break;
                case 502:
                    err.message = '网络错误'
                    break;
                case 503:
                    err.message = '服务不可用'
                    break;
                case 504:
                    err.message = '网络超时'
                    break;
                case 505:
                    err.message = 'http版本不支持该请求'
                    break;
                default:
                    err.message = `连接错误${err.response.status}`
            }
        } else {
            err.message = "连接到服务器失败"
        }
        uni.$u.toast(err.message)
        return Promise.reject(err.message);
    })
}
