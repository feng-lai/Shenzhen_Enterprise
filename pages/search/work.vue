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
			<form @submit="formSubmit">
				<view class="group">
					<view class="left text">性别</view>
					<view class="left">
						<radio-group name="gender">
							<radio value="1">男</radio>
							<radio value="2">女</radio>
						</radio-group>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">年龄</view>
					<view class="left"><input name="age_start" style="width: 80rpx;"></view>
					<view class="left">岁-</view>
					<view class="left"><input name="age_end" style="width: 80rpx;"></view>
					<view class="left">岁</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">学历</view>
					<view class="left">
						<radio-group name="edu">
							<radio value="1">小学</radio>
							<radio value="2">初中</radio>
							<radio value="3">高中</radio>
							<radio value="4">大专</radio>
							<radio value="5">本科</radio>
						</radio-group>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*所在城市</view>
					<view class="left"><input type="text" placeholder="请输入城市" name="city"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*期望月薪</view>
					<view class="left"><input type="text" placeholder="请输入期望月薪" name="salary"></view>
					<view class="left">元起</view>
					<view class="clear"></view>
				</view>
				<view class="group" style="text-align: center;">
					<button class="other_btn" form-type="submit">搜索</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				user: '',
				year:'',
				city:'',
				time:'',
				show:false
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
					key:'searchWork',
					data:e.detail.value,
					success() {
						uni.navigateTo({
							url:'/pages/search/workResult'
						})
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
								title:'找工人'
							})
						}
					}
				})
			}
		},
		onShareAppMessage(){
			
		},
		onLoad() {
			that=this
			that.getView()
			if(!that.show){
				uni.setNavigationBarTitle({
					title:''
				})
			}
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
	@import url('@/static/css/searchWork.css')
</style>
