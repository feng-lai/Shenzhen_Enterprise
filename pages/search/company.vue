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
			<form @submit="formSubmit">
				<view class="group">
					<view class="left text">公司名称</view>
					<view class="left"><input placeholder="例如:武汉公司" name="name" style="width: 300rpx;"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">城市</view>
					<view class="left">
						<input placeholder="例如:武汉市" name="city" style="width: 200rpx;">
					</view>
					<view class="left text">成立年份</view>
					<view class="left">
						<input placeholder="例如:2012" name="date_incorporation" style="width: 200rpx;">
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">注册资本</view>
					<view class="left"><input placeholder="例如:200" name="registered_capital" style="width: 120rpx;"></view>
					<view class="left">万</view>
					<!-- <view class="left">自定义</view>
					<view class="left"><input name="registered_capital_start" style="width: 80rpx;"></view>
					<view class="left">万-</view>
					<view class="left"><input name="registered_capital_end" style="width: 80rpx;"></view>
					<view class="left">万</view> -->
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">tag关键字</view>
					<view class="left"><input name="tag" style="width: 300rpx;"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left">
						<checkbox name="tel_num" value="1" color="#FFCC33" style="transform:scale(0.7)"
							:disabled="(user.auths == -1 && user.type == 1)?true:false" />排除无联系电话的结果(普通用户无法使用)
					</view>
					<view class="clear"></view>
				</view>
				<navigator hover-class="none" url="/pages/search/companyResult" class="group" v-if="time && user.type == 2 && user.auths == -1">上次搜索结果 : {{time}}</navigator>
				<view class="group" style="text-align: center;">
					<button class="other_btn" form-type="submit">搜索</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				user: '',
				year:'',
				city:'',
				time:''
			}
		},
		methods: {
			getUser() {
				var that = this
				uni.request({
					url: app.globalData.url + 'user/info',
					data: {
						api_token: app.globalData.api_token
					},
					success(res) {
						if (res.data.result == 1) {
							that.user = res.data.data
						}
					}
				})
			},
			formSubmit(e){
				uni.setStorage({
					key:'searchCompany',
					data:e.detail.value,
					success() {
						uni.navigateTo({
							url:'/pages/search/companyResult'
						})
					}
				})
			}
		},
		onShareAppMessage(){
			
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
					})
				}
			})
			uni.getStorage({
				key:'searchCompanyHistory',
				success(res) {
					that.time = res.data.time
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
