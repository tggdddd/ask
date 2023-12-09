<template>
  <view>
    <!-- 滚动信息 -->
    <u-notice-bar :text="message"></u-notice-bar>

    <!-- 表单 -->
    <view class="post">
      <u-form labelPosition="top" labelWidth="150" :model="post" :rules="rules" ref="post">
        <!-- 标题 -->
        <u-form-item
            label="提问标题："
            prop="title"
            ref="title"
        >
          <u-input v-model="post.title" placeholder="请输入提问标题"></u-input>
        </u-form-item>

        <!-- 描述 -->
        <u-form-item
            label="提问描述："
            prop="content"
            ref="content"
        >
          <u--textarea v-model="post.content" placeholder="请输入提问描述"></u--textarea>
        </u-form-item>

        <!-- 分类 -->
        <u-form-item
            label="提问分类："
            prop="cate"
            ref="cate"
            @click="CateShow = true;"
        >
          <u-input :value="post.cate" readonly placeholder="请选择提问分类">
            <template #suffix>
              <u-icon name="arrow-right"></u-icon>
            </template>
          </u-input>
        </u-form-item>

        <!-- 积分 -->
        <u-form-item
            label="悬赏积分："
            prop="point"
            ref="point"
        >
          <u-input v-model="post.point" placeholder="请输入悬赏积分"></u-input>
        </u-form-item>

        <u-picker :show="CateShow" :columns="CateData" keyName="name" @cancel="CateShow = false"
                  @confirm="CateCheck"></u-picker>

        <view class="btn">
          <u-button type="primary" text="发布提问" formType="submit" @click="submit"></u-button>
        </view>
      </u-form>
    </view>

    <!-- 提醒组件 -->
    <u-toast ref="notice"></u-toast>
  </view>
</template>

<script>
import UCell from "@/uni_modules/uview-ui/components/u-cell/u-cell.vue";

export default {
  components: {UCell},
  onReady() {
    //onReady 为uni-app支持的生命周期之一
    //设置表单验证规则
    this.$refs.post.setRules(this.rules)
  },
  onShow() {
    this.CateList()

    this.business = uni.getStorageSync('business') ? uni.getStorageSync('business') : {}
  },
  data() {
    return {
      message: '您可以在本页录入您的提问信息，录入成功后将会出现在首页的悬赏大厅中，等待其他用户的回复。',
      CateShow: false,
      business: {},
      CateData: [[
        {name: 'WEB前端', id: 1},
        {name: 'WEB后端', id: 2},
        {name: '测试', id: 3},
        {name: '运维', id: 4},
      ]],
      post: {
        title: '',
        content: '',
        point: 10,
        cateid: '',
        cate: ''
      },
      rules: {
        title: {
          type: 'string',
          required: true,
          message: '请填写提问标题',
          trigger: ['blur', 'change']
        },
        content: {
          type: 'string',
          required: true,
          message: '请描述一下问题的详细内容',
          trigger: ['blur', 'change']
        },
        point: {
          type: 'number',
          required: true,
          message: '请填写悬赏积分',
          trigger: ['blur', 'change']
        },
        cate: {
          type: 'string',
          required: true,
          message: '请选择提问分类',
          trigger: ['blur', 'change']
        },
      }
    }
  },
  methods: {
    async CateList() {
      var result = await uni.$u.http.post('/post/cate')
      this.CateData = [result.data]
    },
    CateCheck(e) {
      this.CateShow = false
      this.post.cate = e.value[0].name
      this.post.cateid = e.value[0].id
    },
    submit() {
      //判断是否有通过表单验证
      this.$refs.post.validate()
          .then(async res => {
            //请求发帖
            var result = await uni.$u.http.post("/post/add", this.post)
            this.$refs.notice.show({
              type: 'success',
              message: result.msg,
              complete: () => {
                uni.$u.route({
                  url: result.data.redirect,
                  params: {
                    postid: result.data.postid
                  }
                })
                return false
              }
            })
          })
          .catch(error => {
            console.log(error)
            this.$refs.notice.show({
              type: 'error',
              message: '效验失败'
            })
          })
    }
  }
}
</script>

<style>
/* 表单 */
.post {
  width: 95%;
  margin: 10px auto;
}

.btn {
  width: 60%;
  margin: 0 auto;
  margin-top: 10px;
}
</style>