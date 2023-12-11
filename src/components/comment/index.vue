<script>
// 引入自定义组件
import Vue from 'vue'
import UviewUi from "@/uni_modules/uview-ui/components/uview-ui/uview-ui.vue";
import Comments from '@/components/comment/index.vue'

export default {
  name:"Comments",
  components:{UviewUi, Comments },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    postid: {
      type: [String, Number],
      required: true,
      default: 0
    },
    pid: {
      type: [String, Number],
      required: true,
      default: 0
    }
  },
  created() {
    this.business = uni.getStorageSync('business') ? uni.getStorageSync('business') : {}
    this.CommentData()
    this.PostData()
  },
  data() {
    return {
      comlist: [],
      business: {},
      MenuShow: false,
      AnswerShow: false,
      AcceptShow: false,
      PostShow: false,
      content: `
					<b>这个是正文内容</b>
					<img src="https://cdn.uviewui.com/uview/swiper/2.jpg" />
				`,
      //当前点击的评论
      current: {
        id: 0,
        busid: 0,
        index: 0,
      },
      post: {},
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
    //采纳
    async accept() {
      this.AcceptShow = true
      this.MenuShow = false
    },
    //采纳答案确认
    async AcceptAnswer() {
      this.AcceptShow = false
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
        comid: this.current.id,
        postid: this.postid,
        busid: this.business.id
      }
      var result = await uni.$u.http.post('/post/accept', data)
      this.$refs.notice.show({
        type: 'success',
        message: result.msg
      })
      this.PostData()
      this.CommentData()
    },
    async MenuToggle(comment,index ) {
      this.MenuShow = true
      this.current = comment
      this.current.index = index
    },
    async AnswerToggle() {
      this.MenuShow = false
      this.AnswerShow = true
    },
    async CommentToggle(index) {
      const list = this.comlist
      list[index].show = !list[index].show
      this.$set(this, "comlist", list)
    },
    //帖子详情
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
          }).catch(() => {
        uni.$u.route({
          type: 'navigateBack',
          delta: 1
        })
      })
    },
    //评论列表
    async CommentData() {
      //组装数据
      var data = {
        postid: this.postid,
        pid: this.pid
      }
      if (this.business && this.business.id) {
        data.busid = this.business.id
      }
      uni.$u.http.post('/comment/index', data)
          .then(result => {
            const list = result.data
            list.map((item) => {
              item.show = false
            })
            Vue.set(this, 'comlist', list)
          })
    },
    //点赞和取消点赞
    async like(comid) {
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
        comid: comid,
        postid: this.postid,
        busid: this.business.id
      }
      var result = await uni.$u.http.post('/post/like', data)
      this.$refs.notice.show({
        type: 'success',
        message: result.msg
      })
      this.CommentData()
    },
    //提交表单
    submit() {
      //判断是否有通过表单验证
      this.$refs.answer.validate()
          .then(async res => {
            this.AnswerShow = false
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
              pid: this.current.id,
              content: this.comment.content,
              postid: this.postid,
              busid: this.business.id,
            }
            uni.$u.http.post('/comment/add', data)
                .then(result => {
                  this.$refs.notice.show({
                    type: 'success',
                    message: result.msg
                  })
                  this.comment.content = ''
                  //隐藏掉评论列表
                  this.comlist[this.current.index].show = true
                  this.comlist[this.current.index].comment_count++
                }).catch()

            //调用另一个组件中的方法
          })
          .catch(error => {
            console.log(error)
            this.$refs.notice.show({
              type: 'error',
              message: '效验失败'
            })
          })
    },
    //删除评论
    async PostDel() {
      this.PostShow = false
      this.MenuShow = false
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
        comid: this.current.id,
        postid: this.postid,
        busid: this.business.id
      }
      var result = await uni.$u.http.post('/business/comment_del', data)
      this.$refs.notice.show({
        type: 'success',
        message: result.msg
      })
      this.PostData()
      this.CommentData()

    }
  }
}
</script>

<template>
  <view class="list">
    <view class="item" v-for="(comment, index) in comlist" style="position: relative">
      <!-- 基本信息 -->
      <view class="business">
        <!-- 头像 -->
        <view class="avatar">
          <image mode="aspectFit" v-if="comment.business.avatar_text" :src="comment.business.avatar_text"></image>
          <image mode="aspectFit" v-else src="/static/avatar.png"></image>
        </view>
        <!-- 用户 -->
        <view class="base">
          <view class="name">
            <view class="nickname" v-if="comment.business.nickname">{{ comment.business.nickname }}</view>
            <view class="nickname" v-else>匿名</view>
            <view class="createtime">{{ comment.createtime_text }}</view>
          </view>
          <view class="desc">这家伙很懒，什么都没写！</view>
        </view>
      </view>

      <!-- 详细内容 -->
      <view class="content" style="position:relative;">
        {{ comment.content }}
      </view>
      <!-- 采纳信息 -->
<!--      <view class="accept">-->
        <!--            <u-tag v-if="post.accept && comment.status == '1'" text="已采纳" type="success" plain shape="circle"-->
        <!--                   size="large"></u-tag>-->
        <view class="filterTag" v-if="post.accept && comment.status == '1'">
          采纳
        </view>
<!--      </view>-->
      <!-- 操作 -->
      <view class="action">
        <view class="left">
          <view class="tag">
            <!-- 判断当前登录的用户id在不在点赞的列表中 -->
            <u-tag v-if="business.id && comment.like_list.includes(business.id.toString())"
                   :text="`取消点赞 ${comment.like_count}`" type="success" icon="thumb-up"
                   @click="like(comment.id)"></u-tag>
            <u-tag v-else :text="`点赞 ${comment.like_count}`" type="success" plain icon="thumb-up"
                   @click="like(comment.id)"></u-tag>
          </view>
          <view class="comment" @click="CommentToggle(index)">
            <u-icon name="chat" size="25"></u-icon>
            {{ comment.comment_count }} 条评论
          </view>
        </view>
        <view class="right" v-if="post.status == '0'">
          <view class="operation">
            <u-icon name="more-dot-fill" size="20" @click="MenuToggle(comment, index)"></u-icon>
          </view>
        </view>
      </view>

      <Comments :postid="postid" :pid="comment.id" :show="true" v-if="comment.comment_count>0 && comment.show"/>
    </view>
    <!-- 弹出层 -->
    <u-popup :show="MenuShow" @close="MenuShow = false">
      <view class="menu">
        <view class="grid">
          <u-grid :border="true">
            <u-grid-item v-if="post.status == '0'" @click="AnswerToggle">
              <u-icon name="edit-pen-fill" size="35"></u-icon>
              <u--text type="warning" text="补充回答" align="center"></u--text>
            </u-grid-item>
            <u-grid-item v-if="post.status == '0' && post.busid == business.id" @click="accept">
              <u-icon name="checkmark" size="35"></u-icon>
              <u--text type="success" text="采纳此答案" align="center"></u--text>
            </u-grid-item>
            <u-grid-item v-if="post.status == '0' && (post.busid == business.id || current.busid == business.id)"
                         @click="PostShow = true">
              <u-icon name="trash-fill" size="35"></u-icon>
              <u--text type="error" text="删除" align="center"></u--text>
            </u-grid-item>
          </u-grid>
        </view>
        <u-button class="btn" type="error" text="取消" @click="MenuShow = false"></u-button>
      </view>
    </u-popup>
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
    <!-- 采纳弹框组件 -->
    <u-modal :show="AcceptShow" :title="'采纳提醒'" :content="'是否确认采纳此答案'" showCancelButton
             :closeOnClickOverlay="true" @cancel="AcceptShow = false" @close="AcceptShow = false"
             @confirm="AcceptAnswer"></u-modal>
    <!-- 删除弹框组件 -->
    <u-modal :show="PostShow" :title="'删除提醒'" :content="'是否确认删除评论'" showCancelButton
             :closeOnClickOverlay="true" @cancel="PostShow = false; MenuShow = false"
             @close="PostShow = false; MenuShow = false" @confirm="PostDel"></u-modal>
    <!-- 提醒组件 -->
    <u-toast ref="notice"></u-toast>
  </view>
</template>

<style scoped lang="scss">

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
.filterTag {
  position: absolute;
  right: 1.4em;
  top: 42%;
  --font: 2em;
  font-size: 15px;
  display: block;
  /* border-radius: 50%; */
  width: calc( var(--font) + 2em);
  height: var(--font);
  transform: rotateZ(25deg);
  text-align: center;
  line-height: var(--font);
  padding: 0.4em;
  box-shadow: 0 0 36px #ffa50059, inset 0 0 6px #ffa50075, 0 0 22px #ffac0096, 0 0 336px #ffa5001c;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  background: repeating-linear-gradient(333deg,transparent 6px, #ffac0073, transparent 100px);
  opacity: 0.3;
}
</style>