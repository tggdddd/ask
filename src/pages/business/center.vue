<template>
  <view class="content">
    <view class='header'>
      <view class='person'>
        <!-- 基本资料 -->
        <view class="info">
          <view class="avatar">
            <!-- #ifdef H5 || APP-PLUS -->
            <image v-if="info.user && info.user.avatar_text" :src="info.user && info.user.avatar_text"></image>
            <image v-else src="/static/logo.png"></image>
            <!-- #endif -->

            <!-- #ifdef MP-WEIXIN -->
            <image v-if="info.user && info.user.avatar_text" :src="info.user && info.user.avatar_text"></image>
            <open-data v-else type="userAvatarUrl"></open-data>
            <!-- #endif -->
          </view>

          <view class="base">

            <!-- #ifdef MP-WEIXIN -->
            <view class="nickname">
              {{ info.user && (info.user.nickname ? info.user.nickname : info.user.mobile) }}
            </view>
            <!-- #endif-->

            <!-- #ifdef H5 || APP -->
            <view class="nickname">
              {{ info.user && (info.user.nickname ? info.user.nickname : info.user.mobile) }}
            </view>
            <!-- #endif-->
            <view class="desc">这家伙很懒，什么也没写！</view>
          </view>
        </view>

        <!-- 宫格布局 -->
        <view class="grid">
          <u-grid :border="true">
            <u-grid-item>
              <u--text color="#fff" text="提问" align="center"></u--text>
              <u--text color="#fff" :text="info.ask && info.ask.count" align="center"></u--text>
            </u-grid-item>
            <u-grid-item>
              <u--text color="#fff" text="回答" align="center"></u--text>
              <u--text color="#fff" :text="info.answer && info.answer.count" align="center"></u--text>
            </u-grid-item>
            <u-grid-item>
              <u--text color="#fff" text="收藏" align="center"></u--text>
              <u--text color="#fff" :text="info.collection && info.collection.count" align="center"></u--text>
            </u-grid-item>
          </u-grid>
        </view>

        <!-- 按钮 -->
        <view class="btnlist"  v-if="busid!=business.id">
          <view class="btn" @click="flowee">
            <u-button type="success" icon="man-add" :text="info.follow?'已关注':'关注'"></u-button>
          </view>
          <view class="btn" @click="messageOpen = true">
            <u-button type="warning" icon="more-circle" text="发私信"></u-button>
          </view>
        </view>
      </view>
      <view class='nav'>
        <view class="nav-item" @click="currentTab=0" :class="currentTab===0?'active':''">提问</view>
        <view class="nav-item" @click="currentTab=1" :class="currentTab===1?'active':''">回答</view>
        <view class="nav-item" @click="currentTab=2" :class="currentTab===2?'active':''">收藏</view>
      </view>
    </view>
    <view id="listWrap">

      <!--提问-->
      <view class="list" v-if="currentTab===0">
        <u-swipe-action v-if="busid==business.id">
          <u-swipe-action-item :options="action" @click="deletePost(post.id)" v-for="post in info.ask.list"
                               :key="post.id">
            <view class="swipe-action u-border-top u-border-bottom">
              <view class="item">
                <view class="business">
                  <view class="avatar">
                    <image mode="aspectFit" v-if="post.business && post.business.avatar_text"
                           :src="post.business && post.business.avatar_text"></image>
                    <image mode="aspectFit" v-else src="/static/avatar.png"></image>
                  </view>
                  <view class="author">{{ post.business && post.business.nickname }}</view>
                </view>

                <view class="info">
                  <navigator :url="`/pages/post/info?postid=${post.id}`" hover-class="none">
                    <view class="title">{{ post.title }}</view>
                    <view class="createtime">发布时间：{{ post.createtime_text }}</view>
                    <view class="category">分类：{{ post.cate.name }}</view>
                    <view class="join">
                      <view class="status">{{ post.status_text }}</view>
                      <view class="point">￥{{ post.point }}</view>
                      <view class="count">{{ post.comment_text }}人参与回复</view>
                    </view>
                  </navigator>
                </view>
              </view>
            </view>
          </u-swipe-action-item>
        </u-swipe-action>
        <view class="item" v-for="post in  info.ask.list" :key="post.id" v-else>
          <view class="business">
            <view class="avatar">
              <image mode="aspectFit" v-if="post.business && post.business.avatar_text"
                     :src="post.business && post.business.avatar_text"></image>
              <image mode="aspectFit" v-else src="/static/avatar.png"></image>
            </view>
            <view class="author">{{ post.business && post.business.nickname }}</view>
          </view>

          <view class="info">
            <navigator :url="`/pages/post/info?postid=${post.id}`" hover-class="none">
              <view class="title">{{ post.title }}</view>
              <view class="createtime">发布时间：{{ post.createtime_text }}</view>
              <view class="category">分类：{{ post.cate.name }}</view>
              <view class="join">
                <view class="status">{{ post.status_text }}</view>
                <view class="point">￥{{ post.point }}</view>
                <view class="count">{{ post.comment_text }}人参与回复</view>
              </view>
            </navigator>
          </view>
        </view>
      </view>


      <!--回答-->
      <view class="list" v-if="currentTab===1">
        <u-swipe-action v-if="busid==business.id">
          <u-swipe-action-item :options="action" @click="deleteAnswer(answer.id)" v-for="answer in  info.answer.list"
                               :key="answer.id">
            <view class="item">
              <u-cell-group :border="false">
                <u-cell :title="answer.content">
                  <template #value>
                    <navigator :url="`/pages/post/info?postid=${answer.postid}`" hover-class="none">
                      <u-button plain>查看帖子</u-button>
                    </navigator>
                  </template>
                  <template #label>
                    <view style="display: flex;color: #909399">
                      {{ answer.createtime_text }}
                      <u-icon style="margin-left: 1em" name="thumb-up-fill"/>
                      {{ answer.like_count }}
                    </view>
                    <view class="filterTag" v-if="answer.status!=0">
                      采纳
                    </view>
                  </template>
                </u-cell>
              </u-cell-group>
            </view>
          </u-swipe-action-item>
        </u-swipe-action>
        <view class="item" v-else v-for="answer in  info.answer.list" :key="answer.id">
          <u-cell-group :border="false">
            <u-cell :title="answer.content">
              <template #value>
                <navigator :url="`/pages/post/info?postid=${answer.postid}`" hover-class="none">
                  <u-button plain>查看帖子</u-button>
                </navigator>
              </template>
              <template #label>
                <view style="display: flex;color: #909399">
                  {{ answer.createtime_text }}
                  <u-icon style="margin-left: 1em" name="thumb-up-fill"/>
                  {{ answer.like_count }}
                </view>
                <view class="filterTag" v-if="answer.status!=0">
                  采纳
                </view>
              </template>
            </u-cell>
          </u-cell-group>
        </view>
      </view>

      <!--提问-->
      <view class="list" v-if="currentTab===2">
        <u-swipe-action v-if="busid==business.id">
          <u-swipe-action-item :options="action" @click="deleteCollection(post.id)" v-for="post in info.collection.list"
                               :key="post.id">
            <view class="swipe-action u-border-top u-border-bottom">
              <view class="item">
                <view class="business">
                  <view class="avatar">
                    <image mode="aspectFit" v-if="post.business && post.business.avatar_text"
                           :src="post.business && post.business.avatar_text"></image>
                    <image mode="aspectFit" v-else src="/static/avatar.png"></image>
                  </view>
                  <view class="author">{{ post.business && post.business.nickname }}</view>
                </view>

                <view class="info">
                  <navigator :url="`/pages/post/info?postid=${post.id}`" hover-class="none">
                    <view class="title">{{ post.title }}</view>
                    <view class="createtime">发布时间：{{ post.createtime_text }}</view>
                    <view class="category">分类：{{ post.cate.name }}</view>
                    <view class="join">
                      <view class="status">{{ post.status_text }}</view>
                      <view class="point">￥{{ post.point }}</view>
                      <view class="count">{{ post.comment_text }}人参与回复</view>
                    </view>
                  </navigator>
                </view>
              </view>
            </view>
          </u-swipe-action-item>
        </u-swipe-action>
        <view class="item" v-for="post in  info.collection.list" :key="post.id" v-else>
          <view class="business">
            <view class="avatar">
              <image mode="aspectFit" v-if="post.business && post.business.avatar_text"
                     :src="post.business && post.business.avatar_text"></image>
              <image mode="aspectFit" v-else src="/static/avatar.png"></image>
            </view>
            <view class="author">{{ post.business && post.business.nickname }}</view>
          </view>

          <view class="info">
            <navigator :url="`/pages/post/info?postid=${post.id}`" hover-class="none">
              <view class="title">{{ post.title }}</view>
              <view class="createtime">发布时间：{{ post.createtime_text }}</view>
              <view class="category">分类：{{ post.cate.name }}</view>
              <view class="join">
                <view class="status">{{ post.status_text }}</view>
                <view class="point">￥{{ post.point }}</view>
                <view class="count">{{ post.comment_text }}人参与回复</view>
              </view>
            </navigator>
          </view>
        </view>
      </view>


      <view id="listLoading">
        <view style="text-align: center;width: 100%;
height: 3em;line-height: 3em; color:  #c8c9cc">{{ listLoading ? '加载中' : '已到末尾' }}
        </view>
      </view>
    </view>
    <!-- 提醒组件 -->
    <u-toast ref="notice"></u-toast>

    <!-- 弹框组件 -->
    <u-modal :show="show" :title="'提醒'" :content="content" showCancelButton :closeOnClickOverlay="true"
             @cancel="show = false" @close="show = false" @confirm="confirm"></u-modal>
    <send-message v-model="messageOpen" @submit="sendMessage"/>
  </view>
</template>

<script>
import UCellGroup from "@/uni_modules/uview-ui/components/u-cell-group/u-cell-group.vue";
import UCell from "@/uni_modules/uview-ui/components/u-cell/u-cell.vue";
import UText from "@/uni_modules/uview-ui/components/u-text/u-text.vue";
import UIcon from "@/uni_modules/uview-ui/components/u-icon/u-icon.vue";
import UviewUi from "@/uni_modules/uview-ui/components/uview-ui/uview-ui.vue";
import UButton from "@/uni_modules/uview-ui/components/u-button/u-button.vue";
import ULink from "@/uni_modules/uview-ui/components/u-link/u-link.vue";
import USwipeActionItem from "@/uni_modules/uview-ui/components/u-swipe-action-item/u-swipe-action-item.vue";
import USwipeAction from "@/uni_modules/uview-ui/components/u-swipe-action/u-swipe-action.vue";
import SendMessage from "@/components/sendMessage.vue";
import UModal from "@/uni_modules/uview-ui/components/u-modal/u-modal.vue";
import UToast from "@/uni_modules/uview-ui/components/u-toast/u-toast.vue";

export default {
  components: {
    UToast,
    UModal,
    SendMessage, USwipeAction, USwipeActionItem, ULink, UButton, UviewUi, UIcon, UText, UCell, UCellGroup},
  data() {
    return {
      messageOpen:false,
      show: false,
      busid: null,
      business: {},
      content: '是否确认删除',
      action: [{
        text: '删除',
        style: {
          backgroundColor: 'rgb(245, 108, 108)',
        }
      }],
      info: {
        ask: {},
        collection: {},
        answer: {}
      },
      currentTab: 0,
      listLoading: false,
      intersection: null,
      modalTarget:null,
      tempDeleteId: null
    }
  },
  onLoad(query) {
    // 谁的主页
    const {id} = query
    this.business = uni.getStorageSync('business') ? uni.getStorageSync('business') : {}
    if (id != null) {
      this.busid = id
    } else {
      this.busid = this.business.id
    }
    //   加载主页信息
    uni.$u.http.post("/business/user_info", {
          busid: this.busid
        }
    ).then(result => {
      this.$set(this, "info", result.data)
    })
  },
  onShow(options) {
    this.$nextTick(() => {
      this.monitorListLoading()
    })

  },
  onHide() {
    this.monitorListLoading(true)
  },
  onPullDownRefresh() {
    this.refresh().finally(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    /**
     * 发送私信
     * @param content
     */
    async sendMessage(content){
       uni.$u.http.post('/business/send_letter',{
        busid: this.busid,
         content
      }).then(result=>{
         this.$refs.notice.show({
           type: 'success',
           message: result.msg
         })
       }).finally(()=>{
         this.messageOpen = false
       })

    },
    async flowee(){
      const result  = await uni.$u.http.post('/post/flowee',{
        busid: this.business.id
      })
      this.$refs.notice.show({
        type: 'success',
        message: result.msg
      })
      this.$set(this.info,"follow",result.data)
    },
    deleteCollection(postId) {
      this.modalTarget = 0
      if (!this.show){
        this.tempDeleteId = postId
        this.show = true
        return
      }
      uni.$u.http.post("/business/collect_del", {
            postid: this.tempDeleteId
          }
      ).then(res => {
        this.info.collection.list.splice(this.info.collection.list.findIndex(e=>e.id === this.tempDeleteId),1)
        this.info.collection.count -= 1;
        this.$refs.notice.show({
          type: 'success',
          message: res.msg,
        })
      })
    },
    deletePost(postid) {
      this.modalTarget = 1
      if (!this.show){
        this.tempDeleteId = postid
        this.show = true
        return
      }
      uni.$u.http.post("/business/post_del", {
            postid: this.tempDeleteId
          }
      ).then(res => {
        this.info.ask.list.splice(this.info.ask.list.findIndex(e=>e.id === this.tempDeleteId),1)
        this.info.ask.count -= 1;
        this.$refs.notice.show({
          type: 'success',
          message: res.msg,
        })
      })
    },
    deleteAnswer(answerId) {
      this.modalTarget = 2
      if (!this.show){
        this.tempDeleteId = answerId
        this.show = true
        return
      }
      uni.$u.http.post("/business/comment_del", {
            id: this.tempDeleteId
          }
      ).then(res => {
        this.info.answer.list.splice(this.info.answer.list.findIndex(e=>e.id === this.tempDeleteId),1)
        this.info.answer.count -= 1;
        this.$refs.notice.show({
          type: 'success',
          message: res.msg,
        })
      })
    },
    confirm() {
      switch (this.modalTarget){
        case 0:
          this.deleteCollection();
          break;
        case 1:
          this.deletePost();
          break;
        case 2:
          this.deleteAnswer();
          break;
      }
      this.show = false
    },
    refresh() {
      return uni.$u.http.post("/business/user_info", {
            busid: this.busid
          }
      ).then(result => {
        this.$set(this, "info", result.data)
      }).finally(() => {
      })
    },
    monitorListLoading(close) {
      if (close === true) {
        this.intersection && this.intersection.disconnect()
        return
      }
      const intersection = uni.createIntersectionObserver(this, {
        thresholds: 0,
        initialRatio: 0, // 初始相交比例
        observeAll: false //多个节点同时观察
      })
      intersection.relativeToViewport(0)
      intersection.observe("#listLoading", result => {
        // 加载更多数据
        // console.log(result)
        if (result.intersectionRatio > 0 && result.intersectionRatio !== 1) {
          this.loadMore()
        }
      })
      this.intersection = intersection
    },
    loadMore() {
      if (this.currentTab === 0) {
        if (this.info.ask.count <= this.info.ask.list.length) {
          return
        }
        this.listLoading = true
        uni.$u.http.post("/business/user_info_post", {
              busid: this.busid,
              offset: this.info.ask.offset
            }
        ).then(result => {
          let list = this.info.ask.list
          list.push(...result.data.list)
          this.$set(this.info.ask, "list", list)
          this.$set(this.info.ask, "count", result.data.count)
          this.$set(this.info.ask, "offset", result.data.offset)
        }).finally(() => {
          this.listLoading = false
        })
      } else if (this.currentTab === 1) {
        if (this.info.answer.count <= this.info.answer.list.length) {
          return
        }
        this.listLoading = true
        uni.$u.http.post("/business/user_info_answer", {
              busid: this.busid,
              offset: this.info.answer.offset
            }
        ).then(result => {
          let list = this.info.answer.list
          list.push(...result.data.list)
          this.$set(this.info.answer, "list", list)
          this.$set(this.info.answer, "count", result.data.count)
          this.$set(this.info.answer, "offset", result.data.offset)
        }).finally(() => {
          this.listLoading = false
        })
      } else if (this.currentTab === 2) {
        if (this.info.collection.count <= this.info.collection.list.length) {
          return
        }
        this.listLoading = true
        uni.$u.http.post("/business/user_info_collection", {
              busid: this.busid,
              offset: this.info.collection.offset
            }
        ).then(result => {
          let list = this.info.collection.list
          list.push(...result.data.list)
          this.$set(this.info.collection, "list", list)
          this.$set(this.info.collection, "count", result.data.count)
          this.$set(this.info.collection, "offset", result.data.offset)
        }).finally(() => {
          this.listLoading = false
        })
      }
    }
  }
}
</script>


<style>
.filterTag {
  position: absolute;
  right: 8em;
  top: 6px;
  --font: 2em;

  color: transparent;
  text-shadow: 0 0 2px orange;
  transform: rotateZ(25deg);
  font-size: 15px;
  display: block;
  border-radius: 50%;
  width: var(--font);
  height: var(--font);
  text-align: center;
  line-height: var(--font);
  padding: .4em;
  box-shadow: 0 0 6px orange, inset 0 0 6px orange;
  backdrop-filter: blur(16px);
  opacity: .8;
}

.content {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

.person {
  background-image: url("/static/titlebg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  padding: 30px 30px 10px;
}

.person .info {
  display: flex;
  width: 100%;
  margin-bottom: 15px;
}

.person .info .avatar {
  width: 4em;
  height: 4em;
  overflow: hidden;
  border-radius: 100%;
  margin-right: 1em;
  flex-shrink: 0;
}

.person .info .avatar image {
  width: 100%;
  height: 100%;
}

.person .info .base {
  color: #fff;
  font-size: 1em;
}

.person .info .base .nickname {
  margin-bottom: 7px;
}

.person .info .base .desc {
  font-size: .8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* 改成你需要的行数 */
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.person .grid {
  margin-bottom: 15px;
}

.person .btnlist {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
}

.person .btnlist .btn {
  margin-right: 10px;
}


.nav {
  display: flex;
  background-color: #f1f6f9;
  position: relative;
  justify-content: space-around;
  align-items: center;
  align-content: center;
}

.nav .nav-item {
  height: 110rpx;
  line-height: 110rpx;
  text-align: center;
  color: #666;
  font-size: 30rpx;
}

.nav .active {
  color: #000;
  font-weight: 600;
}

.nav .active-line {
  background-color: #038fff;
  width: 35rpx;
  height: 4rpx;
  position: absolute;
  top: 86rpx;
  transition: left 0.2s;
}

.list .item {
  display: flex;
  width: 100%;
  padding: 10px;
  margin: 0 auto;
}

.business {
  width: 20%;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 10px;
}

.avatar {
  width: 100%;
  height: 5em;
}

.avatar image {
  width: 100%;
  height: 100%;
}

.author {
  text-align: center;
  font-size: .8em;
  color: #999;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.info {
  font-size: .9em;
  color: #999;
}

.info .title, .info .createtime, .info .category, .info .status, .info .join {
  margin-bottom: 2px;
}

.info .title {
  font-size: 1.1em;
  width: 95%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #000;
  text-decoration: underline;
  font-weight: bold;
}

.info .status {
  background: #fff8e5;
  color: #fa3534;
  padding: 1px 2px;
  border: 1px solid #fa3534;
  border-radius: 3px;
  margin-right: 5px;
}

.info .join {
  display: flex;
  align-items: center;
  align-content: center;
  color: #fa3534;
}

.count {
  margin-right: 10px;
}

.info .point {
  width: 4em;
  text-align: center;
  background: #fff8e5;
  color: #f19049;
  padding: 2px;
  margin-right: 10px;
}
</style>
