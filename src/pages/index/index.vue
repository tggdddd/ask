<template>
	<view class="content">
		<view class='header'>
			<view class='search'>
			  <view class='slogan'>知识社区</view>
			  <input class="uni-input search-area" focus placeholder="搜索你想了解的问题或用户..." />
			</view>
			<view class='nav'>
			  <view class="nav-item active">全部</view>
			  <view class="nav-item">分类1</view>
			  <view class="nav-item">分类2</view>
			  <view class="nav-item">分类3</view>
			  <view class="nav-item">分类4</view>
			</view>
		</view>

		<view class="list">
			<view class="item">
				<view class="business">
					<view class="avatar">
						<image mode="aspectFit" src="/static/avatar.png"></image>
					</view>
					<view class="author">RickyFlex</view>
				</view>
				
				<view class="info">
					<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
					<view class="createtime">发布时间：2023-07-17</view>
					<view class="category">分类：WEB前端</view>
					
					<view class="join">
						<view class="status">已解决</view>
						<view class="point">￥20.00</view>
						<view class="count">20人参与回复</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="business">
					<view class="avatar">
						<image mode="aspectFit" src="/static/avatar.png"></image>
					</view>
					<view class="author">RickyFlex</view>
				</view>
				
				<view class="info">
					<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
					<view class="createtime">发布时间：2023-07-17</view>
					<view class="category">分类：WEB前端</view>
					
					<view class="join">
						<view class="status">已解决</view>
						<view class="point">￥20.00</view>
						<view class="count">20人参与回复</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="business">
					<view class="avatar">
						<image mode="aspectFit" src="/static/avatar.png"></image>
					</view>
					<view class="author">RickyFlex</view>
				</view>
				
				<view class="info">
					<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
					<view class="createtime">发布时间：2023-07-17</view>
					<view class="category">分类：WEB前端</view>
					
					<view class="join">
						<view class="status">已解决</view>
						<view class="point">￥20.00</view>
						<view class="count">20人参与回复</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="business">
					<view class="avatar">
						<image mode="aspectFit" src="/static/avatar.png"></image>
					</view>
					<view class="author">RickyFlex</view>
				</view>
				
				<view class="info">
					<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
					<view class="createtime">发布时间：2023-07-17</view>
					<view class="category">分类：WEB前端</view>
					
					<view class="join">
						<view class="status">已解决</view>
						<view class="point">￥20.00</view>
						<view class="count">20人参与回复</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="business">
					<view class="avatar">
						<image mode="aspectFit" src="/static/avatar.png"></image>
					</view>
					<view class="author">RickyFlex</view>
				</view>
				
				<view class="info">
					<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
					<view class="createtime">发布时间：2023-07-17</view>
					<view class="category">分类：WEB前端</view>
					
					<view class="join">
						<view class="status">已解决</view>
						<view class="point">￥20.00</view>
						<view class="count">20人参与回复</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="business">
					<view class="avatar">
						<image mode="aspectFit" src="/static/avatar.png"></image>
					</view>
					<view class="author">RickyFlex</view>
				</view>
				
				<view class="info">
					<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
					<view class="createtime">发布时间：2023-07-17</view>
					<view class="category">分类：WEB前端</view>
					
					<view class="join">
						<view class="status">已解决</view>
						<view class="point">￥20.00</view>
						<view class="count">20人参与回复</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


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
	}

	.slogan {
		font-size: 50rpx;
		color: #fff;
		padding-top: 20rpx;
		padding-bottom: 30rpx;
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
	}

	.nav .nav-item {
		width: 25%;
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

	.list .item{
		display: flex;
		width:100%;
		padding:10px;
		margin:0 auto;
		border-bottom:1px solid #e9e6e6;
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

	.author{
		text-align: center;
		font-size:.8em;
		color:#999;
		width:100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.info{
		font-size:.9em;
		color:#999;
	}

	.info .title, .info .createtime, .info .category, .info .status, .info .join{
		margin-bottom:2px;
	}

	.info .title{
		font-size:1.1em;
		width:95%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color:#000;
		text-decoration: underline;
		font-weight: bold;
	}

	.info .status{
		background:#fff8e5;
		color:#fa3534;
		padding:1px 2px;
		border:1px solid #fa3534;
		border-radius: 3px;
		margin-right:5px;
	}

	.info .join{
		display: flex;
		align-items: center;
		align-content: center;
		color:#fa3534;
	}

	.count{
		margin-right:10px;
	}

	.info .point{
		width:4em;
		text-align: center;
		background:#fff8e5;
		color:#f19049;
		padding:2px;
		margin-right:10px;
	}
</style>
