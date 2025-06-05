<template>
	<view>
		<view class="top">
			<navigator hover-class="none" url="/pages/search/search">
				<input type="" name="word" disabled="true" :placeholder="word"/>
			</navigator>
		</view>
		<swiper class="swiper" :autoplay="autoplay" :interval="interval" :duration="duration">
			<block v-for="(v,k) in banner" v-if="v.type == 1">
				<swiper-item>
					<navigator class="swiper-item uni-bg-red" hover-class="none" :url="'/pages/banner/banner?url='+v.url">
						<image :src="v.img" mode="aspectFill"/>
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<view class="entry">
			<view class="title">我的意向</view>
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
							<image src="https://xcx.huitengzx.com/images/article.png">
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
				banner:'',
				more: 'loading',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				word:''
			}
		},
		components: {
			uniLoadMore
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
						if(info.length<that.num){
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
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			var that = this; //是否已登录
			that.getBanner()
			uni.setStorage({
				key: 'url',
				data: '/' + page.route,
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
@import url('@/static/css/article.css')
</style>
