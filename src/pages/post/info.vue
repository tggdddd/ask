<template>
  <view class="post">
    <view class="info">
      <view class="tag">
        <view class="item">
          <u-tag class="item" :text="post.cate.name" type="success" plain icon="tags-fill"></u-tag>
        </view>

        <view class="item">
          <u-tag class="item" :text="post.status_text" type="error" plain icon="tags-fill"></u-tag>
        </view>

        <view class="item">
          <u-tag class="item" v-if="post.collect" text="取消收藏" type="warning" icon="star"
                 @click="collection"></u-tag>
          <u-tag class="item" v-else text="收藏" type="warning" plain icon="star" @click="collection"></u-tag>
        </view>


      </view>

      <view class="title">{{ post.title }}</view>

      <view class="author">
        <!-- 头像 -->
        <view class="avatar" @click="ToBus(post.business.id)">
          <image mode="aspectFit" v-if="post.business.avatar_text" :src="post.business.avatar_text"></image>
          <image mode="aspectFit" src="/static/avatar.png"></image>
        </view>

        <!-- 昵称 -->
        <view @click="ToBus(post.business.id)"  class="nickname">{{ post.business.nickname ? post.business.nickname : '匿名用户' }}</view>

        <!-- 发布时间 -->
        <view class="createtime">发布于 {{ post.createtime_text }}</view>

        <view class="follow">
          <u-tag class="item" :text="post.followee===true?'已关注':'关注'" type="success" plain @click="flowee" size="mini"></u-tag>
        </view>
      </view>

      <!-- 正文内容 -->
      <view class="content">
        <u-parse :content="post.content"></u-parse>
      </view>

      <!-- 宫格布局 -->
      <view class="grid">
        <u-grid :border="true">
          <u-grid-item>
            <u--text type="warning" text="关注者" align="center"></u--text>
            <u--text type="warning" :text="`${post.collect_text}人`" align="center"></u--text>
          </u-grid-item>
          <u-grid-item>
            <u--text type="success" text="回答人数" align="center"></u--text>
            <u--text type="success" :text="`${post.comment_text}人`" align="center"></u--text>
          </u-grid-item>
          <u-grid-item>
            <u--text type="error" text="悬赏积分" align="center"></u--text>
            <u--text type="error" :text="post.point" align="center"></u--text>
          </u-grid-item>
        </u-grid>
      </view>

      <u-divider text="分割线" :dot="true"></u-divider>

      <view class="bottom">
        <view class="btn" v-if="post.status == '0'">
          <u-button type="primary" text="我来回答" @click="AnswerToggle"></u-button>
        </view>
        <view class="btn" v-if="business.id == post.busid">
          <u-button type="warning" text="修改提问" @click="edit"></u-button>
        </view>
      </view>
    </view>

    <!-- 评论列表 -->
    <comment ref="comment" v-if="refresh" :postid="postid" :pid="0" :show="true"/>

    <!-- 回答弹出层 -->
    <u-popup :show="AnswerShow" @close="AnswerShow = false">
      <view class="answer">
        <u-form labelPosition="top" labelWidth="150" :model="comment" :rules="rules" ref="answer">
          <!-- 描述 -->
          <u-form-item
              label="回答描述："
              prop="content"
              ref="content"
          >
            <u--textarea v-model="comment.content" placeholder="请输入回答描述"></u--textarea>
          </u-form-item>

          <view class="btn">
            <u-button type="primary" text="提交答案" formType="submit" @click="submit"></u-button>
          </view>
        </u-form>
      </view>
    </u-popup>

    <!-- 提醒组件 -->
    <u-toast ref="notice"></u-toast>
  </view>
</template>

<script>
import comment from "@/components/comment/index.vue";

export default {
  components:{ comment },
  onLoad(options) {
    var postid = options.postid ? options.postid : 0;
    this.postid = postid
    this.business = uni.getStorageSync('business') ? uni.getStorageSync('business') : {}
    //调用请求数据
    this.PostData()
    this.CommentData()
  },
  data() {
    return {
      postid: 0,
      post: {
        cate: {},
        business: {},
        followee: false
      },
      refresh: true,
      comlist: [],
      business: {},
      MenuShow: false,
      AnswerShow: false,
      content: `
					<b>这个是正文内容</b>
					<img src="https://cdn.uviewui.com/uview/swiper/2.jpg" />
				`,
      comment: {
        content: '',
      },
      rules: {
        content: {
          type: 'string',
          required: true,
          message: '请填写回答内容',
          trigger: ['blur', 'change']
        },
      }
    }
  },
  methods: {
    ToBus(busid)
    {
      uni.$u.route({
        type: 'navigateTo',
        url: '/pages/business/center',
        params:{
            id:busid
        }
      })
    },
    AnswerToggle()
    {
      this.AnswerShow = true
      this.comment.pid = 0
    },
    async PostData() {
      //组装数据
      var data = {
        postid: this.postid,
      }
      if (this.business.id) {
        data.busid = this.business.id
      }
      uni.$u.http.post('/post/info', data)
          .then(result => {
            this.post = result.data
            this.$set(this.post,"followee",result.data.followee)
          }).catch(err => {
        uni.$u.route({
          type: 'navigateBack',
          delta: 1
        })
      })
    },
    async collection() {
      //未登录
      if (!this.business || !this.business.id) {
        this.$refs.notice.show({
          type: 'error',
          message: '请先登录'
        })
        return false
      }
      //组装数据
      var data = {
        postid: this.postid,
        busid: this.business.id
      }
      var result = await uni.$u.http.post('/post/collect', data)
      this.$refs.notice.show({
        type: 'success',
        message: result.msg
      })
      this.post.collect = !this.post.collect
    },
    async CommentData() {
      //组装数据
      var data = {postid: this.postid}
      if (this.business.id) {
        data.busid = this.business.id
      }
      var result = await uni.$u.http.post('/comment/index', data)
      this.comlist = result.data
    },
    async flowee(){
      const result  = await uni.$u.http.post('/post/flowee',{
        busid: this.post.busid
      })
      this.$refs.notice.show({
        type: 'success',
        message: result.msg
      })
      this.$set(this.post,"followee",result.data)
    },
    edit() {
      //做程序的时候，要把add发帖界面复制一份出来修改为edit编辑界面
      uni.$u.route({
        type: 'navigateTo',
        url: '/pages/post/edit',
        params:{
          id: this.postid
        }
      })
    },
    submit() {
      //判断是否有通过表单验证
      this.$refs.answer.validate()
          .then(async res => {
            this.AnswerShow = false
            //未登录
            if(!this.business || !this.business.id) {
              this.$refs.notice.show({
                type: 'error',
                message: '请先登录'
              })
              return false
            }
        //组装数据
            var data = {
              pid: 0,
              content: this.comment.content,
              postid: this.postid,
              busid: this.business.id,
            }
            var result = await uni.$u.http.post('/comment/add', data)
              this.$refs.notice.show({
                type: 'success',
                message: result.msg
              })
            this.comment.content = ''
            this.$refs.comment.CommentData()
          }).catch(error => {
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
.post {
  background: #f4f6f8;
}

.info {
  width: 95%;
  margin: 0 auto;
  margin-bottom: 20px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 0 3px 0 rgba(0, 78, 255, .1);
}

/* 标签 */
.info .tag {
  display: flex;
  margin-bottom: 10px;
}

.info .tag .item {
  margin-right: 5px;
}

/* 标题 */
.info .title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: .5em;
}

/* 用户信息 */
.author {
  display: flex;
  align-items: center;
  align-content: center;
  color: #999;
  font-size: .8em;
}

.author .avatar {
  width: 2em;
  height: 2em;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 10px;
}

.author .avatar image {
  width: 100%;
  height: 100%;
}

.author .nickname, .author .createtime {
  margin-right: 10px;
}


/* 详细内容 */
.content {
  margin: 10px 0px;
  overflow: hidden;
}

.content img {
  width: 100%;
  height: 100%;
}

.info .bottom {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.info .bottom .btn {
  width: 10em;
  margin-right: 15px;
}

.info .bottom .btn:last-of-type {
  margin-right: 0px;
}

/* 评论列表 */
.list {
  width: 97%;
  margin: 0 auto;
}

.list .item {
  width: 91%;
  margin: 0 auto;
  margin-bottom: 5px;
  padding: 15px;
  background: #fff;
  box-shadow: 0 0 3px 0 rgba(0, 78, 255, .1);
}

.list .item .business {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.business .avatar {
  width: 2em;
  height: 2em;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 10px;
  flex-shrink: 0;
}

.business .avatar image {
  width: 100%;
  height: 100%;
}

.business .base {
  width: 90%;
  padding: 5px 10px;
  font-size: .8em;
}

.business .base .name {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.business .base .name .nickname {
  font-weight: bold;
  color: #000;
}

.business .base .name .createtime {
  color: #999;
}

.business .base .desc {
  color: #999;
}

.item .content {
  font-size: .9em;
  color: #303133;
  margin-bottom: 30px;
}

.item .action {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
}

.item .action .left {
  display: flex;
}

.item .action .right {
  display: flex;
  align-items: flex-end;
  align-content: flex-end;
  margin-top: 4px;
}

.item .action .tag {
  margin-right: 10px;
}

.item .action .comment {
  display: flex;
  align-content: center;
  align-items: center;
}

/* 弹出菜单 */
.menu .grid {
  margin: 20px 0px;
}

.btn {
  border-radius: 0px;
}

/* 回答内容 */
.answer {
  padding: 20px;
}
</style>