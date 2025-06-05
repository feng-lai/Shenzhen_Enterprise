<template>
	<view v-show="show">
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
			<view class="title">共找{{all}}条结果</view>
			<view class="entry">
				<block v-for="(v,k) in info">
					<view class="row">
						<view class="left">
							<view class="title">{{v.name}}</view>
							<view class="desc">性别 : {{v.gender}}<text style="margin-left: 20rpx;">年龄 : {{v.age}}</text></view>
							<view class="desc">学历 : {{v.edu}}<text style="margin-left: 20rpx;">婚否 : {{v.is_marry}}</text></view>
							<view class="desc">电话 : {{v.phone}}<text style="margin-left: 20rpx;">所在城市 : {{v.city}}</text></view>
							<view class="desc">期望月薪 : {{v.salary}}</view>
						</view>
						<view class="clear"></view>
					</view>
				</block>
				<view style="width: 100%;"><uni-load-more :status="more" :contentText="contentText"></uni-load-more></view>
			</view>
		</view>
	</view>
</template>

<script>
	var that
	const app = getApp()
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				page:1,
				num:10,
				info:'',
				user:'',
				more: 'loading',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				all:0,
				datas:'',
				show:false
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
				uni.request({
					url:app.globalData.url+'search/work',
					data:data,
					success(res) {
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
			},
			getView(){
				uni.request({
					url:app.globalData.url + 'view',
					success(res) {
						if(res.data.data == 1){
							that.show = true
							uni.setNavigationBarTitle({
								title:'找工人结果'
							})
						}
					}
				})
			}
			
		},
		onPageScroll(e) {

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
						that.getUser()
						uni.getStorage({
							key:'searchWork',
							success(ros){
								that.datas = ros.data
								that.getInfo()
							}
						})
					})
				}
			})
			
		},
		onReachBottom() {
			this.getInfo()
		},
		onLoad() {
			that=this
			that.getView()
			if(!that.show){
				uni.setNavigationBarTitle({
					title:''
				})
			}
		}
	}
</script>

<style>
	@import url('@/static/css/searchCompany.css')
</style>
