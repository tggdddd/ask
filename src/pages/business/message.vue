<template>
	<view class="content">
		<view class='header'>
			<view class='search'>
			  <input @input="changeSearch" class="uni-input search-area" focus placeholder="搜索你想了解的私信..." />
			</view>
		</view>

		<!-- 侧滑列表 -->
		<view class="list">
			<view class="swipe-action u-border-top u-border-bottom" v-for="(item,index) in list">
				<view class="item">
					<view class="business">
						<view class="avatar">
              <image mode="aspectFit" v-if="item.from_user.avatar_text" :src="item.from_user.avatar_text"/>
              <image mode="aspectFit" v-else src="/static/logo.png"/>
						</view>
					</view>

					<view class="info">
            <view class="nickname">{{ item.from_user.nickname || item.from_user.mobile }}</view>
						<view class="desc"> {{item.content }}</view>
						<view class="action">
							<view class="btn">
								<u-button @click="sendLetter(item.from_user.id)" type="primary" text="发私信" size="mini" shape="circle"></u-button>
							</view>
							<view class="btn" v-if="item.status==0">
                  <u-button @click="remarkRead(item.id,index)"  type="warning" :plain="true" text="已读" size="mini" shape="circle"></u-button>
							</view>
							<view class="btn">
								<u-button  @click="deleteLetter(item.id,index)" type="error" text="删除" size="mini" shape="circle"></u-button>
							</view>
						</view>
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
    <send-message v-model="messageOpen" @submit="sendMessage"/>
		<!-- 弹框组件 -->
		<u-modal :show="show" :title="'提醒'" :content="content" showCancelButton :closeOnClickOverlay="true" @cancel="show = false" @close="show = false" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import SendMessage from "@/components/sendMessage.vue";

  export default {
    components: {SendMessage},
		data()
		{
			return {
				show: false,
				content: '是否确认删除私信',
        list: [],
        offset: 0,
        count:0,
        listLoading: false,
        messageOpen:false,
        confirmId: 0,
        confirmAction:0,
        confirmIndex: 0,
        searchValue:""
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
		methods:{
      /**
       * 发送私信
       * @param content
       */
      async sendMessage(content){
        uni.$u.http.post('/business/send_letter',{
          busid: this.confirmId,
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
      //发送私信
      sendLetter(id){
        this.confirmId = id
        this.messageOpen = true
      },
      //标记为已读
      remarkRead(id,index){
        uni.$u.http.post("/business/letter_remark", {
              id:id
            }
        ).then(result => {
          if (result.data){
            this.list[index].status = 1
          }
          // this.$refs.notice.show({
          //   type: 'success',
          //   message: result.msg,
          // })
        })
      },
      //删除私信
      deleteLetter(id,index){
        this.confirmAction = "del"
        this.confirmId = id
        this.confirmIndex = index
        this.show = true
      },
      changeSearch(el) {
        this.searchValue = el.target.value
        this.refresh()
      },
      confirm() {
       if (this.confirmAction="del"){
         uni.$u.http.post("/business/letter_del", {
               id:this.confirmId
             }
         ).then(result => {
           if (result.data){this.list.splice(this.confirmIndex, 1)}
           this.$refs.notice.show({
             type: 'success',
             message: result.msg,
           })
         })
       }
        this.show = false
      },
      async refresh() {
        this.list = []
        this.offset = 1
        this.count = 1
        this.loadMore()
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
          if (this.count <= this.list.length) {return}
          this.listLoading = true
          uni.$u.http.post("/business/letter_list", {
                offset: this.followOffset,
                searchValue: this.searchValue
              }
          ).then(result => {
            let list = this.list
            list.push(...result.data.list)
            this.list = list
            this.count = result.data.count
            this.offset = result.data.offset
          }).finally(() => {
            this.listLoading = false
          })
      }
		}
	}
</script>

<style>
	.content{
		width:100%;
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

	.list .item{
		display: flex;
		width:95%;
		margin:10px auto;
	}

	.business{
		width:20%;
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 10px;
		margin-right:10px;
	}

	.avatar{
		width:100%;
		height:5em;
	}

	.avatar image{
		width:100%;
		height:100%;
	}

	.info{
		font-size:.9em;
    width:100%;
		color:#999;
	}

	.info .nickname, .info .desc{
		margin-bottom:2px;
	}

	.info .nickname{
		font-size:1.1em;
		width:95%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color:#000;
		font-weight: bold;
	}

	.info .desc{
		font-size:.8em;
		width:100%;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		margin-bottom:.5em;
		/* 改成你需要的行数 */
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.info .action{
		display: flex;
		width:100%;
		justify-content: flex-end;
	}

	.info .action .btn{
		margin-right:10px;
	}
</style>
