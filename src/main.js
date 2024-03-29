import Vue from 'vue'
import './uni.promisify.adaptor'
import uView from "uview-ui";
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView);
const app = new Vue({
  ...App
})
app.$mount()

//挂载请求封装
require('./services/request')(app)
