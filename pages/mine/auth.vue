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
		<view class="record">
			<view class="title">我的认证</view>
			<view class="result" v-if="!record.length">
				<view class="row">
					<view class="text">提交企业信息认证，获取更多商机</view>
					<button class="other_btn" @click="dingyue()">点击认证</button>
				</view>
			</view>
			<view class="result" v-if="record.length">
				<block v-for="(v,k) in record">
					<view class="row" v-if="v.status == 1">
						<view class="text">(已提交){{company.name}}认证正在处理 --{{v.created_at}}</view>
					</view>
					<view class="row" v-if="v.status == 2">
						<view class="text">{{company.name}}认证通过 --{{v.created_at}}</view>
						<navigator class="option" hover-class="none" :url="'/pages/mine/company?id='+company.id">
							<button class="other_btn">去我的公司</button>
						</navigator>
					</view>
					<view class="row" v-if="v.status == -1">
						<view class="text">(认证失败){{company.reason?company.reason:v.reason}} --{{v.created_at}}</view>
						<navigator class="option" hover-class="none" :url="'/pages/auth/auth?id='+company.id">
							<button class="other_btn">重新认证</button>
						</navigator>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				user:'',
				record:'',
				company:'',
				banner:'',
				word:''
			}
		},
		onShareAppMessage(){
			
		},
		methods: {
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
			dingyue(){
				wx.requestSubscribeMessage({
					tmplIds: ['5K_7e9jbqoYIGyYfr3KawmJoi5B7I43kQk7Oh2TaXY8'],
					complete(res){
						uni.redirectTo({
							url:'/pages/auth/auth'
						})
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
			},
			getRecord(){
				var that = this
				uni.request({
					url:app.globalData.url+'auths/record',
					data:{api_token:app.globalData.api_token},
					success(res) {
						if(res.data.result == 1){
							that.record = res.data.data
							that.company = res.data.company
						}
					}
				})
			},
		},
		onShow() {
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
						that.getRecord()
						that.getBanner()
					})
				}
			})
			uni.getStorage({
				key:'searchDefault',
				success(res){
					that.word = res.data
				}
			})
		}
	}
</script>

<style>
	@import url('@/static/css/myAuth.css')
</style>
