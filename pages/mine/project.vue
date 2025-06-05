<template>
	<view>
		<view class="top">
			<navigator hover-class="none" url="/pages/search/search">
				<input type="" name="word" disabled="true" :placeholder="word"/>
			</navigator>
		</view>
		<swiper class="swiper" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration" style="height: 200rpx;">
			<block v-for="(v,k) in banner" v-if="v.type == 2">
				<swiper-item>
					<navigator class="swiper-item uni-bg-red" hover-class="none" :url="'/pages/banner/banner?url='+v.url">
						<image :src="v.img" style="height: 200rpx;"/>
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<view class="entry">
			<view class="title">项目招募动态</view>
			<block v-for="(v,k) in info">
				<navigator class="row" hover-class="none" :url="'/pages/mine/project_detail?id='+v.id" v-if="v.is_created">
					<view class="user">
						<image :src="v.profile_pic">
							<view class="left">
								<view class="text">{{v.name}}</view>
								<view class="text">{{v.created_at}}</view>
							</view>
							<view class="right" v-if="v.is_project" style="background-color: red; color: white; line-height: inherit; height: auto; border-radius: 10rpx; padding:5rpx;">有更新</view>
							<view class="clear"></view>
					</view>
					<view class="content">
						<view class="left img">
							<image :src="v.img" mode="aspectFit">
						</view>
						<view class="left">
							<view class="title">{{v.title}}<text style="float: right;">状态 : {{v.text}}</text></view>
							<view class="desc">{{v.desc}}</view>
							<view class="desc" style="height:auto;line-height:inherit;"><text style="float: right; margin-left: 120rpx;">{{v.num}}人感兴趣</text><text style="float: right;">浏览量 : {{v.view}}</text></view>
						</view>
						<view class="clear"></view>
					</view>
				</navigator>
				<navigator class="row" hover-class="none" :url="'/pages/mine/project_detail2?id='+v.id" v-else>
					<view class="user">
						<image :src="v.profile_pic">
							<view class="left">
								<view class="text">{{v.name}}</view>
								<view class="text">{{v.created_at}}</view>
							</view>
							<view class="clear"></view>
					</view>
					<view class="content">
						<view class="left img">
							<image :src="v.img" mode="aspectFit">
						</view>
						<view class="left">
							<view class="title">{{v.title}}<text style="float: right;">状态 : {{v.text}}</text></view>
							<view class="desc">{{v.desc}}</view>
						</view>
						<view class="clear"></view>
					</view>
				</navigator>
			</block>
			<view style="width: 100%;"><uni-load-more :status="more" :contentText="contentText"></uni-load-more></view>
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
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				page: 1,
				num: 10,
				info: [],
				cate: [],
				more: 'loading',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				banner:'',
				word:'',
				mine:'',
			}
		},
		onReachBottom() {
			this.getInfo()
		},
		onShareAppMessage(){
			
		},
		methods: {
			getInfo() {
				var that = this
				uni.request({
					url: app.globalData.url + 'project/entry',
					data: {
						num: that.num,
						page: that.page,
						api_token:app.globalData.api_token
					},
					success(res) {
						let page = that.page;
						var content = that.info; //页码为1时
						if (page == 1) {
							content = [];
						}
						var info = res.data.data; //后台请求拿到的结果
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.info = content.concat(info)
						if (page <= res.data.lastPage) {
							that.page++
						}else{
							that.more = 'noMore'
						}
						if(info.length < that.num){
							that.more = 'noMore'
						}
					}
				})
			},
			getBanner(){
				var that = this
				uni.request({
					url:app.globalData.url+'banner',
					success(res) {
						that.banner = res.data.data
					}
				})
			}
		},
		onLoad(e) {
			that = this
		},
		onShow() {
			var that = this
			that.getBanner()
			uni.setStorage({
				key: 'url',
				data: '/pages/index/index',
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin()
						that.getInfo()
					})
				}
			})
			uni.getStorage({
				key:'searchDefault',
				success(res){
					that.word = res.data
				}
			})
		},
		onReachBottom() {
			this.getInfo()
		}
	}
</script>

<style>
	@import url('@/static/css/index.css')
</style>
