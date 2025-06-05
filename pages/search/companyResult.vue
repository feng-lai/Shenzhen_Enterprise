<template>
	<view>
		<view class="top">
			<view class="left">
				<image :src="user.profile_pic"></image>
			</view>
			<view class="left">
				<view class="row">
					<view class="text">{{user.name}}</view>
					<navigator class="text status" v-if="user.auths == -1 && user.type == 1" hover-class="none"
						url="/pages/mine/auth">
						<image src="../../static/image/l1.png"
							style="width: 45rpx; height: 45rpx; margin-right: 10rpx;"></image><text>(普通用户)</text>
					</navigator>
					<navigator class="text status" v-if="user.auths == -1 && user.type == 2" hover-class="none"
						url="/pages/mine/auth">
						<image src="../../static/image/l2.png"
							style="width: 45rpx; height: 45rpx; margin-right: 10rpx;"></image><text>(高级用户)</text>
					</navigator>
					<view class="text status" v-if="user.auths == 1">
						<image src="../../static/image/l3.png"
							style="width: 45rpx; height: 45rpx; margin-right: 10rpx;"></image><text>(认证用户)</text>
					</view>
				</view>
			</view>
			<view class="clear"></view>
		</view>
		<view class="list">
			<navigator class="row" :url="'/pages/mine/card?id='+user.cid" hover-class="none">我的名片</navigator>
			<navigator class="row" hover-class="none" url="/pages/mine/article">我的意向</navigator> 
			<navigator class="row" hover-class="none" url="/pages/footprint/footprint">我的足迹</navigator>
			<navigator class="row" hover-class="none" url="/pages/mine/auth">我的认证</navigator>
		</view>
		<view class="com">
			<view class="title" v-if="user.auths == -1 && user.type == 1 && all>=50">共找{{all}}条结果,已为您优选其中50条，如需更多数据，请联系“我的”页面的客服人员</view>
			<view class="title" v-if="user.auths == -1 && user.type == 2 && all>=2000">共找{{all}}条结果,已为您优选其中2000条，如需更多数据，请联系“我的”页面的客服人员</view>
			<view class="title" v-else>共找{{all}}条结果</view>
			<view class="entry">
				<block v-for="(v,k) in info">
					<navigator class="row" hover-class="none" :url="'/pages/company/company?id='+v.id">
						<view class="left img">
							<image :src="v.img" mode="aspectFit">
						</view>
						<view class="left">
							<view class="title">{{v.name}}</view>
							<view class="desc">联系人 : {{v.legal_representative}} <text style="margin-left: 20rpx;">电话 : {{v.tel_num}}</text></view>
							<view class="desc">行业 : {{v.industry}}</view>
							<view class="desc">tag : {{v.tag}}</view>
						</view>
						<view class="clear"></view>
					</navigator>
				</block>
				<view style="width: 100%;"><uni-load-more :status="more" :contentText="contentText"></uni-load-more></view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				page:1,
				num:10,
				hNum:'',
				info:'',
				user:'',
				more: 'loading',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				datas:'',
				all:0,
				searchCompanyHistory:{time:'',height:'',page:''}
			}
		},
		components: {
			uniLoadMore
		},
		onShareAppMessage(){
			
		},
		methods: {
			getInfo(){
				var that = this
				let data = that.datas
				data.page = that.page
				data.num = that.num
				data.api_token = app.globalData.api_token
				uni.request({
					url:app.globalData.url+'search/company',
					data:data,
					success(res) {
						that.contentText.contentnomore = res.data.more
						let his = that.searchCompanyHistory
						his.time = res.data.time
						his.page = that.page
						uni.setStorage({
							key:'searchCompanyHistory',
							data:his
						})
						let page = that.page;
						that.all = res.data.all
						var content = that.info; //页码为1时
						if (page == 1) {
							content = [];
						}
						var info = res.data.data; //后台请求拿到的结果
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.info = content.concat(info)
						that.page++
						if(!res.data.data.length){
							that.more = 'noMore'
						}
						if(info.length < that.num){
							that.more = 'noMore'
						}
						// setTimeout(function(){
						//  	uni.pageScrollTo({
						//  	    scrollTop: 99999999999
						//  	})
						// },1000)
					},complete() {
						uni.hideLoading()
					}
				})
			},
			getInfo2(){
				var that = this
				let data = that.datas
				data.page = that.page
				data.num = that.hNum
				data.api_token = app.globalData.api_token
				uni.request({
					url:app.globalData.url+'search/company',
					data:data,
					success(res) {
						that.contentText.contentnomore = res.data.more
						let his = that.searchCompanyHistory
						his.time = res.data.time
						his.page = that.page
						uni.setStorage({
							key:'searchCompanyHistory',
							data:his
						})
						let page = that.page;
						that.all = res.data.all
						var content = that.info; //页码为1时
						if (page == 1) {
							content = [];
						}
						var info = res.data.data; //后台请求拿到的结果
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.info = content.concat(info)
						that.page++
						if(!res.data.data.length){
							that.more = 'noMore'
						}
						if(info.length < that.num){
							that.more = 'noMore'
						}
						if(that.user.type == 2 && that.user.auths == -1){
							setTimeout(function(){
							 	uni.pageScrollTo({
							 	    duration:500, // 毫秒
							 	    scrollTop:parseInt(that.searchCompanyHistory.height), // 位置
							 	})
							 },1000)
						}
					},complete() {
						uni.hideLoading()
					}
				})
			},
			getUser(){
				var that = this
				uni.request({
					url:app.globalData.url+'user/info',
					data:{api_token:app.globalData.api_token},
					success(res) {
						if(res.data.result == 1){
							that.user = res.data.data
						}
					}
				})
			}
		},
		onPageScroll(e) {
			let his = this.searchCompanyHistory
			his.height = e.scrollTop
			uni.setStorage({
				key:'searchCompanyHistory',
				data:his
			})
		},
		onShow(){
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			var that = this; //是否已登录
			uni.setStorage({
				key: 'url',
				data: '/' + page.route,
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin()
						that.getUser()
						uni.getStorage({
							key:'searchCompanyHistory',
							success(res){
								that.searchCompanyHistory = res.data
								uni.getStorage({
									key:'searchCompany',
									success(ros){
										that.datas = ros.data
										that.hNum = parseInt(res.data.page)*parseInt(that.num)
										console.log(that.hNum)
										that.getInfo2()
									}
								})
							},
							fail() {
								uni.getStorage({
									key:'searchCompany',
									success(ros){
										that.datas = ros.data
										that.getInfo()
									}
								})
							}
						})
						
					})
				}
			})
			
		},
		onReachBottom() {
			this.getInfo()
		}
	}
</script>

<style>
	@import url('@/static/css/searchCompany.css')
</style>
