<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="user">
      <view class="avatar">
        <!-- #ifdef H5 || APP-PLUS -->
        <image v-if="business.avatar_text" :src="business.avatar_text"></image>
        <image v-else src="/static/logo.png"></image>
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <image v-if="business.avatar_text" :src="business.avatar_text"></image>
        <open-data v-else type="userAvatarUrl"></open-data>
        <image v-if="business.id==null" src="/static/logo.png"></image>

        <!-- #endif -->
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <view class="nickname">
        <text v-if="business.id">{{ business.nickname ? business.nickname : business.mobile }}</text>
        <u-button v-else type="primary" :plain="true" @click="login">授权登录</u-button>
      </view>
      <!-- #endif-->

      <!-- #ifdef H5 || APP -->
      <view class="nickname">
        <text v-if="business.id">{{ business.nickname ? business.nickname : business.mobile }}</text>
        <navigator v-else class="btn" url="/pages/business/login">注册登录</navigator>
      </view>
      <!-- #endif-->
    </view>

    <!-- 菜单 -->
    <view class="menulist" v-if="business.id">
      <u-cell-group>
        <u-cell icon="account-fill" title="个人主页" :isLink="true" url="/pages/business/center"></u-cell>
        <u-cell icon="account-fill" title="基本资料" :isLink="true" url="/pages/business/profile"></u-cell>
        <u-cell icon="email-fill" title="邮箱认证" v-if="0==business.auth" :isLink="true" url="/pages/business/email"></u-cell>
        <u-cell icon="integral-fill" title="我的提问" :isLink="true" url="/pages/business/post"></u-cell>
        <u-cell icon="tags-fill" title="我的关注" :isLink="true" url="/pages/business/follow"></u-cell>
        <u-cell icon="email-fill" title="我的私信" :isLink="true" url="/pages/business/message"></u-cell>
        <u-cell icon="rmb" title="余额充值" :isLink="true" url="/pages/business/pay"></u-cell>
        <u-cell icon="pushpin-fill" title="每日签到" :isLink="true" url="/pages/business/checkin"></u-cell>
        <u-cell icon="lock-open" title="解绑账号" v-if="business.openid&&business.openid.length>0"
                @click="unLinkShow = true" :isLink="true"></u-cell>
        <u-cell icon="share-square" title="退出登录" :isLink="true" @click="show = true"></u-cell>
      </u-cell-group>
    </view>
    <view class="menulist" v-else>
      <u-cell-group>
        <u-cell icon="account-fill" title="个人主页" :isLink="true"></u-cell>
        <u-cell icon="account-fill" title="基本资料" :isLink="true"></u-cell>
        <u-cell icon="integral-fill" title="我的提问" :isLink="true"></u-cell>
        <u-cell icon="tags-fill" title="我的关注" :isLink="true"></u-cell>
        <u-cell icon="email-fill" title="我的私信" :isLink="true"></u-cell>
        <u-cell icon="rmb" title="余额充值" :isLink="true"></u-cell>
        <u-cell icon="pushpin-fill" title="每日签到" :isLink="true"></u-cell>
      </u-cell-group>
    </view>
    <!-- 提醒组件 -->
    <u-toast ref="notice"></u-toast>

    <!-- 弹框组件 -->
    <u-modal :show="show" :title="'退出提醒'" :content="'是否确认退出'" showCancelButton :closeOnClickOverlay="true"
             @cancel="show = false" @close="show = false" @confirm="logout"></u-modal>
    <u-modal :show="unLinkShow" @cancel="unLinkShow=false" showCancelButton @close="unLinkShow= false" title="请确认"
             :close-on-click-overlay="true" @confirm="unlink" content="确认要与当前微信号解绑吗"></u-modal>
  </view>
</template>

<script>
export default {
  onShow() {
    this.business = uni.getStorageSync('business') ? uni.getStorageSync('business') : {}
  },
  data() {
    return {
      show: false,
      business: {},
      unLinkShow: false
    }
  },
  methods: {
    //解绑账号
    async unlink() {
      uni.$u.http.post("/business/unlink").then(result => {
        this.$refs.notice.show({
          message: result.msg,
          type: 'success',
          duration: 1000,
          complete: () => {
            this.business.openid = null
            uni.setStorageSync('business', this.business)
          }
        })
      }).finally(()=>{
        this.unLinkShow = false
      })
    },
    //微信授权登录
    login() {
      wx.login({
        success: (login) => {
          var code = login.code
          if (code) {
            uni.$u.http.post('/business/login', {code: code})
                .then(result => {
            //说明授权成功，但是没有账号
            if (result.data.action === 'bind') {
              this.$refs.notice.show({
                message: result.msg,
                type: 'success',
                complete: () => {
                  //跳转
                  uni.$u.route({
                    url: result.data.redirect,
                    params: {
                      openid: result.data.openid
                    }
                  })
                  return false
                }
              })
            } else {
              this.$refs.notice.show({
                type: 'success',
                message: result.msg,
                duration: 1000,
                complete: () => {
                  //登录成功，设置本地存储
                  uni.setStorageSync('business', result.data.info)
                  uni.setStorageSync('token', result.data.info.token)
                  this.business = result.data.info
                }
              })
            }
                })
          }
        }
      })
    },
    logout() {
      this.show = false

      this.$refs.notice.show({
        type: 'success',
        message: '退出成功',
        duration: 1000,
        complete: () => {
          uni.removeStorageSync('business')
          uni.removeStorageSync('token')
          this.business = {}
        }
      })
    },
  }
}
</script>


<style>
/* 用户信息 */
.user {
  width: 100%;
  padding: 40rpx 0rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(rgb(1, 115, 222), rgb(78, 169, 245));
  color: white;
}

.avatar {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.avatar image {
  width: 100%;
  height: 100%;
}

.nickname {
  font-size: 30rpx;
  font-weight: bold;
  margin: 10rpx 0;
}

.login {
  width: 120px !important;
  color: #fff;
  background-color: #4ea9f5;
  margin-top: 20rpx;
  font-size: 30rpx;
  padding: .5em .2em;
}

/* 菜单 */
.menulist {
  width: 100%;
}

.item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: auto;
  width: auto;
  padding: 20rpx 50rpx;
  border-bottom: 20rpx solid rgb(234, 234, 234);
  font-size: 26rpx;
  box-shadow: 0 0 10px #DDD;
}

.nickname .btn {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 100px;
  margin: 0 auto;
  background: #fff;
  color: #000;
  text-align: center;
}

.item image {
  height: 36rpx;
  width: 36rpx;
}
</style>