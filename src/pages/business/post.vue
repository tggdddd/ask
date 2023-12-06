<template>
  <view class="content">
    <view class='header'>
      <view class='search'>
        <input @change.native="changeSearch" @input="changeSearch" class="uni-input search-area" focus placeholder="搜索你想了解的问题或用户..."/>
      </view>
      <view class='nav'>
        <view class="nav-item" @click="currentTab=0" :class="currentTab===0?'active':''">我的提问</view>
        <view class="nav-item" @click="currentTab=1" :class="currentTab===1?'active':''">我的回答</view>
        <view class="nav-item" @click="currentTab=2" :class="currentTab===2?'active':''">我的收藏</view>
      </view>
    </view>


    <view id="listWrap">

      <!--提问-->
      <view class="list" v-if="currentTab===0">
        <u-swipe-action>
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
      </view>
      <!--回答-->
      <view class="list" v-if="currentTab===1">
        <u-swipe-action>
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
      </view>
      <!--提问-->
      <view class="list" v-if="currentTab===2">
        <u-swipe-action>
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
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchValue: "",
      messageOpen: false,
      show: false,
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
      modalTarget: null,
      tempDeleteId: null
    }
  },
  onLoad(query) {
    this.business = uni.getStorageSync('business') ? uni.getStorageSync('business') : {}
    //   加载主页信息
    uni.$u.http.post("/business/user_info", {
          busid: this.business.id,
          searchValue: this.searchValue
        }
    ).then(result => {
      this.$set(this, "info", result.data)
    })
  },
  onShow(options) {
    this.$nextTick(() => {
      this.monitorListLoading()
    })
  }, onHide() {
    this.monitorListLoading(true)
  }, onPullDownRefresh() {
    this.refresh().finally(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    changeSearch(event) {
      this.searchValue = event.target.value
      this.refresh()
    },
    deleteCollection(postId) {
      this.modalTarget = 0
      if (!this.show) {
        this.tempDeleteId = postId
        this.show = true
        return
      }
      uni.$u.http.post("/business/collect_del", {
            postid: this.tempDeleteId
          }
      ).then(res => {
        this.info.collection.list.splice(this.info.collection.list.findIndex(e => e.id === this.tempDeleteId), 1)
        this.$refs.notice.show({
          type: 'success',
          message: res.msg,
        })
      })
    },
    deletePost(postid) {
      this.modalTarget = 1
      if (!this.show) {
        this.tempDeleteId = postid
        this.show = true
        return
      }
      uni.$u.http.post("/business/post_del", {
            postid: this.tempDeleteId
          }
      ).then(res => {
        this.info.ask.list.splice(this.info.ask.list.findIndex(e => e.id === this.tempDeleteId), 1)
        this.$refs.notice.show({
          type: 'success',
          message: res.msg,
        })
      })
    },
    deleteAnswer(answerId) {
      this.modalTarget = 2
      if (!this.show) {
        this.tempDeleteId = answerId
        this.show = true
        return
      }
      uni.$u.http.post("/business/comment_del", {
            id: this.tempDeleteId
          }
      ).then(res => {
        this.info.answer.list.splice(this.info.answer.list.findIndex(e => e.id === this.tempDeleteId), 1)
        this.$refs.notice.show({
          type: 'success',
          message: res.msg,
        })
      })
    },
    confirm() {
      switch (this.modalTarget) {
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
            busid: this.business.id,
        searchValue: this.searchValue
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
              busid: this.business.id,
              offset: this.info.ask.offset,
              searchValue: this.searchValue
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
              busid: this.business.id,
              offset: this.info.answer.offset,
              searchValue: this.searchValue
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
              busid: this.business.id,
              offset: this.info.collection.offset,
              searchValue: this.searchValue
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
.content {
  width: 100%;
  overflow-x: hidden;
}

.search {
  height: 238rpx;
  background-image: url("/static/titlebg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  padding: 0 28rpx;
  display: flex;
  align-items: center;
  align-content: center;
}

.search-area {
  width: 100%;
  height: 88rpx;
  background-color: #fff;
  background-image: url("/static/search.png");
  background-repeat: no-repeat;
  background-size: 30rpx 30rpx;
  background-position: 35rpx 30rpx;
  border-radius: 11rpx;
  line-height: 88rpx;
  text-indent: 78rpx;
  color: #2f2e2e;
  font-size: 30rpx;
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
