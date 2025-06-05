<template>
	<view>
		<view class="top">
			<navigator hover-class="none" url="/pages/search/search">
				<input type="" name="word" disabled="true" :placeholder="word"/>
			</navigator>
		</view>
		<swiper class="swiper" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration">
			<block v-for="(v,k) in banner" v-if="v.type == 1">
				<swiper-item>
					<navigator class="swiper-item uni-bg-red" hover-class="none" :url="'/pages/banner/banner?url='+v.url">
						<image :src="v.img"/>
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<view class="entry">
			<view class="title">平台动态</view>
			<block v-for="(v,k) in info">
				<navigator class="row" hover-class="none" :url="'/pages/trend/detail?id='+v.id">
					<view class="user">
						<image :src="v.profile_pic">
							<view class="left">
								<view class="text">{{v.name}}</view>
								<view class="text">{{v.created_at}}</view>
							</view>
							<view class="right" v-if="v.type == 1">
								找供应
							</view>
							<view class="right" v-if="v.type == 2">
								找需求
							</view>
							<view class="clear"></view>
					</view>
					<view class="content">
						<view class="left img">
							<image :src="v.img" mode="aspectFit">
						</view>
						<view class="left">
							<view class="title">{{v.title}}</view>
							<view class="desc">{{v.content}}</view>
						</view>
						<view class="clear"></view>
					</view>
				</navigator>
			</block>
			<view style="width: 100%;"><uni-load-more :status="more" :contentText="contentText"></uni-load-more></view>
		</view>
		<view class="nav">
			<view class="nav_row">
				<navigator class="left" hover-class="none" url="/pages/index/index" open-type="redirect">
					<view class="img">
						<image src="../../static/image/index.png"></image>
					</view>
					<view class="name">
						首页
					</view>
				</navigator>
				<view class="left">
					<view class="img">
						<image src="../../static/image/trends.png"></image>
					</view>
					<view class="name">
						最新动态
					</view>
				</view>
				<!--  #ifndef  H5 -->
				<navigator class="left" hover-class="none" url="/pages/issue/issue" open-type="redirect">
					<view class="img">
						<image src="../../static/image/issue.png"></image>
					</view>
					<view class="name">
						发布
					</view>
				</navigator>
				<!--  #endif -->
				<navigator class="left" hover-class="none" url="/pages/contact/contact" open-type="redirect">
					<view class="img">
						<image src="../../static/image/contact.png"></image>
					</view>
					<view class="name">
						联系我们
					</view>
				</navigator>
				<!--  #ifndef  H5 -->
				<navigator class="left" hover-class="none" url="/pages/mine/mine" open-type="redirect">
					<view class="img">
						<image src="../../static/image/mine.png"></image>
					</view>
					<view class="name">
						我的
					</view>
				</navigator>
				<!--  #endif -->
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
				word:''
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
					url: app.globalData.url + 'trend/entry',
					data: {
						num: that.num,
						page: that.page
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
		onShow() {
			var that = this
			that.getBanner()
			uni.setStorage({
				key: 'url',
				data: '/pages/index/index',
				success: function() {
					app.isLogin().then(function() {
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
