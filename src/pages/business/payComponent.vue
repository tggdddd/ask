<script>

import UCountDown from "@/uni_modules/uview-ui/components/u-count-down/u-count-down.vue";
import UButton from "@/uni_modules/uview-ui/components/u-button/u-button.vue";
import Pay from "@/pages/business/pay.vue";

export default {
  components: {Pay, UButton, UCountDown},
  data() {
    return {
      statusUrl: '/business/status',
      maxtime: 86400,// 订单超时时间
      pay: {}
    }

  },
  onLoad(query) {
    console.log(query)
    this.pay = JSON.parse(decodeURIComponent(query.pay))
  },
  methods: {
    timeChange(timestamp) {
      this.getStatus(this.pay.id)
    },
    getStatus(payid) {
      uni.$u.http.post(this.statusUrl, {
        payid: payid
      })
          .then(result => {
                // let reurl = result.data.reurl ? result.data.reurl : '';
                // if (reurl) {
                //   uni.navigateTo(reurl)
                // } else {
                if (result.data == 1) {
                  this.$refs.notice.show({
                    type: 'success',
                    message: result.msg,
                    callback: () => {
                      uni.navigateBack()
                    }
                  })
                }

                // }
              }
          ).catch(err => {
        setTimeout(() => {
          uni.navigateBack()
        }, 3000)
        // this.$refs.notice.show({
        //   type: 'error',
        //   message: '服务器异常',
        // })
        // uni.navigateBack()
      })
    },
    openApp() {
      let appurl;
      if (this.pay.paytype == 0) {
        appurl = 'weixin://';
      }
      if (this.pay.paytype == 1) {
        appurl = 'alipays://';
      }
      // #ifdef APP-PLUS
      plus.runtime.openURL(appurl, function (res) {
        console.log(res);
      });
      // #endif
      // #ifdef H5
      window.open(appurl);
      // #endif
    },
    savePic() {
      console.log("savepci")
      let url = ""
      if (this.pay.paytype == 0) {
        url = this.pay.wxcode
      }
      if (this.pay.paytype == 1) {
        url = this.pay.zfbcode
      }
      console.log("download", url)
      uni.downloadFile({
        url: url,
        success: (res) => {
          console.log("xz", res)
          if (res.statusCode === 200) {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function () {
                uni.showToast({
                  title: "保存成功",
                  icon: "none"
                });
              },
              fail: function () {
                uni.showToast({
                  title: "保存失败，请稍后重试",
                  icon: "none"
                });
              }
            });
          }
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    timeOut() {
      this.$refs.notice.show({
        type: 'error',
        message: '订单超时,请重新支付',
        callback: () => {
          uni.navigateBack()
        }
      })
    }
  }
}
</script>

<template>
  <view>
    <!-- 提醒组件 -->
    <u-toast ref="notice"></u-toast>
    <view class="mod-ct">
      <!--      <view class="order">-->
      <!--      </view>-->
      <view style="margin-top: 10px;">
        <span style="color: red;">提示：付款金额要与显示的金额一致，否则后果自负</span>
      </view>
      <view class="amount" id="money">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;￥<span class="amount2"
                                                                                       id="copyText">{{
          pay.price
        }}</span>元
      </view>
      <view class="paybtn" style="display: none;"><a class="btn btn-primary" href="#" id="alipaybtn"
                                                     target="_blank">启动支付宝App支付</a>
      </view>
      <view class="qrcode-img-wrapper" data-role="qrPayImgWrapper">
        <view class="qrcode-img-area" data-role="qrPayImg">
          <view class="ui-loading qrcode-loading" data-role="qrPayImgLoading" style="display: none;"></view>
          <view style="position: relative;display: inline-block;">
            <img v-if="pay.paytype==0" id="imgCode" :src="pay.wxcode" style="width: 220px;">
            <img v-if="pay.paytype==1" id="imgCode" :src="pay.zfbcode" style="width: 220px;">
          </view>
        </view>
      </view>
      <view class="time-item" style="padding-top: 10px">
        <view class="time-item" id="msg">
          <h1 class="overtime">订单名称：<span>{{ pay.name }}</span></h1>
        </view>
        <view class="time-item">
          <h1>订单号:<span>{{ pay.code }}</span></h1>
        </view>
        <strong id="hour_show"><s id="h"></s>订单支付有效期</strong>
        <u-count-down ref="countdown" autoStart @finish="timeOut" @change="timeChange" :time="3 * 60 * 1000"
                      format="HH:mm:ss"></u-count-down>
        <view class="time-item"></view>
      </view>
      <view class="tip">
        <view class="ico-scan"></view>
        <view class="tip-text">

          <p @click="savePic">点击保存图片</p>
          <p v-if="pay.paytype==0" @click="openApp" id="showtext">打开微信[扫一扫]</p>
          <p v-if="pay.paytype==1" @click="openApp" id="showtext">打开支付宝[扫一扫]</p>
        </view>
      </view>
    </view>
  </view>
</template>
<style>
.mod-title {
  text-align: center;
  border-bottom: 1px solid #ddd;
  background: #fff;
}

h1 {
  font-family: "微软雅黑";
  font-size: 12px;
  margin: 5px 0;
  padding-bottom: 2px;
}

.ico_log {
  display: inline-block;
  width: 130px;
  height: 38px;
  vertical-align: middle;
  margin-right: 7px;
}

.ico-1 {
  background: url("/static/pay/logo_alipay.jpg") no-repeat;
  background-size: cover;
}

.ico-2 {
  background: url("/static/pay/logo_weixin.jpg") no-repeat;
}

.ico-3 {
  background: url("/static/pay/logo_weixin.jpg") no-repeat;
  background-size: cover;
  margin-top: 5px;
  margin-bottom: 5px;
}

.ico-4 {
  background: url("/static/pay/logo_alipay.jpg") no-repeat;
  background-size: cover;
  margin-top: 5px;
  margin-bottom: 5px;
}

.ico-7 {
  background: url("/static/pay/udst.jpg") no-repeat;
  background-size: cover;
  margin-top: 5px;
  margin-bottom: 5px;
}

.mod-title .text {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  vertical-align: middle
}

.mod-ct {
  min-width: 300px;
  max-width: 640px;
  margin: 0 auto;
  margin-top: 15px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  background: #fff url("/static/pay/wave.png") top center repeat-x;
  text-align: center;
  color: #333;
  border: 1px solid #e5e5e5;
  border-top: none
}

.mod-ct .order {
  font-size: 20px;
  padding-top: 10px
}

.mod-ct .amount {
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.mod-ct .amount2 {
  font-size: 25px;
}

.moneySize {
  font-size: 20px;
  color: #f00;
}

.mod-ct .qr-image {
  margin-top: 30px
}

.mod-ct .qr-image img {
  width: 230px;
  height: 230px
}

.mod-ct .detail {
  margin-top: 10px;
  padding-top: 0px;
  padding-bottom: 10px;

}

.mod-ct .detail .arrow .ico-arrow {
  display: inline-block;
  width: 20px;
  height: 11px;
  background: url("/static/pay/wechat-pay.png") -25px -100px no-repeat
}

.mod-ct .detail .detail-ct {
  display: none;
  font-size: 12px;
  text-align: right;
  line-height: 28px
}

.mod-ct .detail .detail-ct dt {
  float: left
}

.mod-ct .detail-open {
  border-top: 1px solid #e5e5e5
}

.mod-ct .detail .arrow {
  padding: 6px 34px;
  border: 1px solid #e5e5e5
}

.mod-ct .detail .arrow .ico-arrow {
  display: inline-block;
  width: 20px;
  height: 11px;
  background: url("/static/pay/wechat-pay.png") -25px -100px no-repeat
}

.mod-ct .detail-open .arrow .ico-arrow {
  display: inline-block;
  width: 20px;
  height: 11px;
  background: url("/static/pay/wechat-pay.png") 0 -100px no-repeat
}

.mod-ct .detail-open .detail-ct {
  display: block
}

.mod-ct .tip {
  margin-top: 20px;
  border-top: 1px dashed #e5e5e5;
  padding: 10px 0;
  position: relative
}

.mod-ct .tip .ico-scan {
  display: inline-block;
  width: 56px;
  height: 55px;
  background: url("/static/pay/wechat-pay.png") 0 0 no-repeat;
  vertical-align: middle;
}

.mod-ct .tip .tip-text {
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  margin-left: 23px;
  font-size: 16px;
  line-height: 28px;
}

.mod-ct .tip .dec {
  display: inline-block;
  width: 22px;
  height: 45px;
  background: url("/static/pay/wechat-pay.png") 0 -55px no-repeat;
  position: absolute;
  top: -23px
}

.mod-ct .tip .dec-left {
  background-position: 0 -55px;
  left: -136px
}

.mod-ct .tip .dec-right {
  background-position: -25px -55px;
  right: -136px
}

.foot {
  text-align: center;
  margin: 30px auto;
  color: #888888;
  font-size: 12px;
  line-height: 20px;
  font-family: "simsun"
}

.copyRight {
  text-align: center;
  color: #888888;
  margin-bottom: 1px;
}

.copyRight a {
  color: #888888;
}

h1 {
  font-family: "微软雅黑";
  font-size: 12px;
  margin: 5px 0;
  padding-bottom: 2px;
}

.time-item strong {
  background: #3ec742;
  color: #fff;
  line-height: 25px;
  font-size: 15px;
  font-family: Arial;
  padding: 0 10px;
  margin-right: 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.item-title {
  background: none;
  line-height: 25px;
  font-size: 24px;
  padding: 0 10px;
  float: left;
}

.paybtn {
  display: inline-block;
  width: 100%;
  height: 80px;
  vertical-align: middle;
  padding-top: 10%;
  margin-right: 7px
}


.submit_alipay {
  font-size: 16px;
  font-family: Arial;
  font-weight: normal;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  border: 1px solid #84bbf3;
  padding: 9px 76px;
  text-decoration: none;
  background: -moz-linear-gradient(center top, #79bbff 105%, #378de5 0%);
  background: -ms-linear-gradient(top, #79bbff 105%, #378de5 0%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#79bbff', endColorstr='#378de5');
  background: -webkit-gradient(linear, left top, left bottom, color-stop(105%, #79bbff), color-stop(0%, #378de5));
  background-color: #79bbff;
  color: #ffffff;
  display: inline-block;
  text-shadow: 1px 1px 0px #528ecc;
  -webkit-box-shadow: 0px 0px 0px 0px #bbdaf7;
  -moz-box-shadow: 0px 0px 0px 0px #bbdaf7;
  box-shadow: 0px 0px 0px 0px #bbdaf7;
}

.submit_alipay:active {
  position: relative;
  top: 1px;
}

.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  width: 80%;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}

.btn:focus,
.btn:active:focus,
.btn.active:focus {
  outline: thin dotted;
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
}

.btn:hover,
.btn:focus {
  color: #333;
  text-decoration: none;
}

.btn:active,
.btn.active {
  background-image: none;
  outline: 0;
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);
}

.btn.disabled,
.btn[disabled],
fieldset[disabled] .btn {
  pointer-events: none;
  cursor: not-allowed;
  filter: alpha(opacity=65);
  -webkit-box-shadow: none;
  box-shadow: none;
  opacity: .65;
}

.btn-primary {
  color: #fff;
  background-color: #428bca;
  border-color: #357ebd;
}

.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active,
.btn-primary.active,
.open > .dropdown-toggle.btn-primary {
  color: #fff;
  background-color: #3071a9;
  border-color: #285e8e;
}

.btn-primary:active,
.btn-primary.active,
.open > .dropdown-toggle.btn-primary {
  background-image: none;
}

.btn-primary .badge {
  color: #428bca;
  background-color: #fff;
}

.f-bold {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}

/* This css button was generated by css-button-generator.com */
@media screen and (max-width: 768px) {
  /*body,.body {*/
  /*max-width: 100%;*/
  /*min-width: 100%;*/
  /*min-height: 100%;*/
  /*width: 100%;*/
  /*}*/
  /*.mod-title {*/
  /*height: 18rem;*/
  /*line-height: 18rem;*/
  /*}*/
  /*.ico_log {*/
  /*width: 40%;*/
  /*height: 12rem;*/
  /*margin-top: 3rem;*/
  /*}*/
}
</style>