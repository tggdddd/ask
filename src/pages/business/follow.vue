<template>
  <view class="content">
    <view class='header'>
      <view class='search'>
        <input @input="changeSearch" class="uni-input search-area" focus placeholder="搜索你想了解的用户..."/>
      </view>
      <view class='nav'>
        <view class="nav-item" @click="currentTab=0;loadMore()" :class="currentTab===0?'active':''">我的关注</view>
        <view class="nav-item" @click="currentTab=1;loadMore()" :class="currentTab===1?'active':''">我的粉丝</view>
      </view>
    </view>
    <view>
      <!-- 侧滑列表 -->
      <view class="list" v-if="currentTab===0">
        <u-swipe-action>
          <u-swipe-action-item :options="action" @click="show = true" v-for="item in starList">
            <navigator url="/pages/post/info" hover-class="none">
              <view class="swipe-action u-border-top u-border-bottom">
                <view class="item">
                  <view class="business">
                    <view class="avatar">
                      <image mode="aspectFit" v-if="item.avatar_text" :src="item.avatar_text"/>
                      <image mode="aspectFit" v-else src="/static/logo.png"/>
                    </view>
                  </view>

                  <view class="info">
                    <view class="nickname">{{ item.nickname || item.mobile }}</view>

                    <view class="desc">
                      这家伙儿很懒，什么也没写！
                    </view>
                  </view>
                </view>
              </view>
            </navigator>
          </u-swipe-action-item>
        </u-swipe-action>
      </view>
      <view class="list" v-if="currentTab===1">
        <u-swipe-action>
          <u-swipe-action-item :options="action" @click="show = true" v-for="item in followList">
            <navigator url="/pages/post/info" hover-class="none">
              <view class="swipe-action u-border-top u-border-bottom">
                <view class="item">
                  <view class="business">
                    <view class="avatar">
                      <image mode="aspectFit" v-if="item.avatar_text" :src="item.avatar_text"/>
                      <image mode="aspectFit" v-else src="/static/logo.png"/>
                    </view>
                  </view>

                  <view class="info">
                    <view class="nickname">{{ item.nickname || item.mobile }}</view>

                    <view class="desc">
                      这家伙儿很懒，什么也没写！
                    </view>
                  </view>
                </view>
              </view>
            </navigator>
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
      show: false,
      content: '是否确认取消关注',
      action: [{
        text: '取消关注',
        style: {
          backgroundColor: 'rgb(245, 108, 108)',
        }
      }],
      followList: [],
      followOffset: 0,
      followCount: 0,
      starList: [],
      starOffset: 0,
      starCount: 0,
      searchValue: "",
      business: {},
      currentTab: 0,
      listLoading: false
    }
  },
  onLoad(query) {
    this.business = uni.getStorageSync('business') ? uni.getStorageSync('business') : {}
    this.refresh()
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
    changeSearch(el) {
      this.searchValue = el.target.value
      this.refresh()
    },
    deleteFollow() {
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
    confirm() {
      this.deleteFollow();
      this.show = false
    },
    async refresh() {
      this.followOffset = 0
      this.starOffset = 0
      this.followList = []
      this.starList = []
      this.followCount = 1
      this.starCount = 1
      this.loadMore()
      return null
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
      // 关注列表
      if (this.currentTab === 0) {
        if (this.starCount <= this.starList.length) {
          return
        }
        this.listLoading = true
        uni.$u.http.post("/business/star", {
              busid: this.business.id,
              offset: this.starOffset,
              searchValue: this.searchValue
            }
        ).then(result => {
          let list = this.starList
          list.push(...result.data.list)
          this.starList = list
          this.starCount = result.data.count
          this.starOffset = result.data.offset
        }).finally(() => {
          this.listLoading = false
        })
      } else if (this.currentTab === 1) {
        if (this.followCount <= this.followList.length) {
          return
        }
        this.listLoading = true
        uni.$u.http.post("/business/follow", {
              busid: this.business.id,
              offset: this.followOffset,
              searchValue: this.searchValue
            }
        ).then(result => {
          let list = this.followList
          list.push(...result.data.list)
          this.followList = list
          this.followCount = result.data.count
          this.followOffset = result.data.offset
        }).finally(() => {
          this.listLoading = false
        })
      }
    }
  }
}
//todo 删除 api
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
  width: 95%;
  margin: 10px auto;
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

.info {
  font-size: .9em;
  color: #999;
}

.info .nickname, .info .desc {
  margin-bottom: 2px;
}

.info .nickname {
  font-size: 1.1em;
  width: 95%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #000;
  font-weight: bold;
}

.info .desc {
  font-size: .8em;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* 改成你需要的行数 */
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

</style>
