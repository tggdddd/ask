<script>

import UCellGroup from "@/uni_modules/uview-ui/components/u-cell-group/u-cell-group.vue";
import UCell from "@/uni_modules/uview-ui/components/u-cell/u-cell.vue";
import UInput from "@/uni_modules/uview-ui/components/u--input/u--input.vue";
import UButton from "@/uni_modules/uview-ui/components/u-button/u-button.vue";

export default {
  components: {UButton, UInput, UCell, UCellGroup},
  data: () => {
    return {
      tips: "获取验证码",
      business: {},
      rules: {
        email: [
          {
            type: 'string',
            required: true,
            message: '请填写邮箱',
            trigger: ['blur', 'change']
          },
          {
            // 自定义验证函数
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return uni.$u.test.email(value);
            },
            message: '邮箱不正确',
            // 触发器可以同时用blur和change
            trigger: ['change', 'blur'],
          }
        ],
        password: {
          type: 'string',
          required: true,
          message: '请填写验证码',
          trigger: ['blur', 'change']
        },
      },
      form: {
        email: "",
        code: ""
      }
    }
  },
  onShow() {
    this.business = uni.getStorageSync('business') ? uni.getStorageSync('business') : {}
    this.form.email = this.business.email
  },
  methods: {
    getCode() {
      if (this.$refs.uCode.canGetCode) {
        uni.showLoading({
          title: '正在获取验证码'
        })
        uni.$u.http.post('business/email_code', {
          email: this.form.email
        }).then(result => {
          this.$refs.uCode.start();
          this.$refs.notice.show({
            type: 'success',
            message: result.msg,
          })
        }).finally(() => {
          uni.hideLoading();
        })
      } else {
        this.$refs.notice.show({
          type: 'warning',
          message: "操作频繁"
        })
      }
    },
    codeChange(text) {
      this.tips = text;
    },
    submit() {
      //判断是否有通过表单验证
      this.$refs.form.validate()
          .then(async res => {
            try {
              uni.$u.http.post('/business/email_valid', this.form)
                  .then(result => {
                    this.$refs.notice.show({
                      type: 'success',
                      message: result.msg,
                      complete: () => {
                        //登录成功，设置本地存储
                        this.business.auth = "1"
                        uni.setStorageSync('business', this.business)
                        //返回的动作
                        uni.$u.route({
                          type: 'navigateBack',
                          delta: 1
                        })
                      }
                    })
                  })
            } catch (e) {
            }
          }).catch(error => {
        this.$refs.notice.show({
          type: 'error',
          message: error
        })
      })
    }
  }
}
</script>

<template>
  <view>
    <view class="user">
      <view class="avatar">
        <!-- #ifdef H5 || APP-PLUS -->
        <image v-if="business.avatar_text" :src="business.avatar_text"></image>
        <image v-else src="/static/logo.png"></image>
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <image v-if="business.avatar_text" :src="business.avatar_text"></image>
        <open-data v-else type="userAvatarUrl"></open-data>
        <!-- #endif -->
      </view>
      <view class="nickname">
        <text v-if="business.id">{{ business.nickname ? business.nickname : business.mobile }}</text>
      </view>
    </view>
    <u-form
        style="width: 90%;margin: auto"
        labelPosition="left"
        labelWidth="70"
        :model="form"
        :rules="rules"
        ref="form"
    >
      <u-form-item
          label="邮箱"
          prop="email"
          borderBottom
          ref="email"
      >
        <u-input v-model="form.email" border="none" placeholder="请输入邮箱"></u-input>
      </u-form-item>
      <u-form-item
          label="验证码"
          prop="code"
          borderBottom
          ref="code"
      >
        <u-input placeholder="请输入验证码" border="none" v-model="form.code">
          <template slot="suffix">
            <u-code
                ref="uCode"
                @change="codeChange"
                seconds="60"
                changeText="X秒重新获取"
            ></u-code>
            <u-button
                @tap="getCode"
                :text="tips"
                type="success"
                size="mini"
            ></u-button>
          </template>
        </u-input>
      </u-form-item>
      <u-button style="margin-top: 32rpx;" type="primary" @click="submit">
        绑定
      </u-button>
    </u-form>
    <!-- 提醒组件 -->
    <u-toast ref="notice"></u-toast>
  </view>
</template>

<style scoped>
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
</style>