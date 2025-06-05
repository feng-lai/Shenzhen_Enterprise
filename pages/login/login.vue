<template>
	<view>
		<view class="logo">
			<u-image src="https://xcx.huitengzx.com/images/login_logo.jpg" width="400rpx" height="400rpx"></u-image>
		</view>
		<view class="text">使用微信登入</view>
		<view class="login">
			<form @submit="submit">
				<!--<u-form-item label="头像">
					<button class="row" open-type="chooseAvatar" @chooseavatar="chose_img">
						<u-avatar :src="'https://xcx.huitengzx.com/storage/userImg/'+img" v-if="img" mode="square" style="display: flex; align-items: center;"></u-avatar>
					</button>
					<input v-model="img" name="img" style="display: none;"/>
				</u-form-item>
				<u-form-item label="昵称">
					<input v-model="name" type="nickname" name="name"/>
				</u-form-item>
				<u-form-item label="手机号" label-width="auto">
					<view class="row">
						<input v-model="phone" name="phone"/>
						<button open-type="getPhoneNumber" @getphonenumber="getphonenumbers" class="other_btn">微信手机号</button>
					</view>
				</u-form-item>
				<view style="text-align: center; margin-top: 100rpx;">
					<button class="other_btn" form-type="submit">
						登录
					</button>
				</view>-->
				<view class="row">
					<u-image src="https://xcx.huitengzx.com/images/login_img.jpg" width="38rpx" height="38rpx"></u-image>
					<button open-type="chooseAvatar" @chooseavatar="chose_img">点击使用微信头像</button>
					<u-avatar :src="'https://xcx.huitengzx.com/storage/userImg/'+img" v-if="img" mode="square"></u-avatar>
					<input v-model="img" name="img" style="display: none;"/>
				</view>
				<view class="row">
					<u-image src="https://xcx.huitengzx.com/images/login_name.jpg" width="38rpx" height="38rpx"></u-image>
					<input v-model="name" type="nickname" name="name" placeholder="点击使用微信昵称"/>
				</view>
				<view class="row">
					<u-image src="https://xcx.huitengzx.com/images/login_phone.jpg" width="38rpx" height="38rpx"></u-image>
					<button open-type="getPhoneNumber" @getphonenumber="getphonenumbers">{{phone?'':'点击使用微信手机号'}}</button>
					<input v-model="phone" name="phone" />
				</view>
				<view class="login_in">
					<button form-type="submit">登入</button>
					<view class="ar">
						<view class="icon"></view>
					</view>
				</view>
				<view class="or">或者</view>
				<navigator hover-class="none" url="/pages/index/index" open-type="redirect" class="to_index">直接进入</navigator>
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
				url: '',
				uid: '',
				code:'',
				img:'',
				name:'',
				phone:''
			}
		},
		onLoad(e) {
			that = this
			this.uid = e.id ? e.id : ''
			uni.getStorage({
				key: 'url',
				success(res) {
					//登录返回的url
					that.url = res.data
				}
			});
		},
		onShareAppMessage(){
			
		},
		methods: {
			getphonenumbers(e) {
				var that = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									uni.request({
										url: app.globalData.url + 'user/phone',
										data: {
											code: loginRes.code,
											encryptedData: e.detail.encryptedData,
											iv: e.detail.iv,
											api_token: app.globalData.api_token
										},
										method: 'post',
										success(res) {
											if (res.data.result == 1) {
												that.phone = res.data.data
											} else {
												uni.showToast({
													title: '系统繁忙，请稍后重试',
													icon: 'none'
												})
											}
											uni.showToast({
												title: res.data.msg,
												icon: 'none'
											})
										}
									})
								}
							});
						}
					}
				});
			},
			chose_img(res){
				uni.uploadFile({
					url: app.globalData.url+'upload_user_img', //仅为示例，非真实的接口地址
					filePath: res.detail.avatarUrl,
					name: 'img',
					success: (res) => {
						that.img = JSON.parse(res.data).data
						
					}
				});
			},
			submit(e) {
				console.log(e)
				if(!e.detail.value.img){
					uni.showToast({
						title:'请上传头像',
						icon:'error'
					})
					return
				}
				that.img = e.detail.value.img
				if(!e.detail.value.name){
					uni.showToast({
						title:'请输入昵称',
						icon:'error'
					})
					return
				}
				that.name = e.detail.value.name
				if(!e.detail.value.phone){
					uni.showToast({
						title:'请输入手机号',
						icon:'error'
					})
					return
				}
				that.phone = e.detail.value.phone
				wx.login({
					success(res) {
						if (res.code) {
							that.code = res.code
							that.login()
						} else {
							console.log('失败！' + res.errMsg)
						}
					}
				})
			},
			login() {
				var that = this
				uni.request({
					url: app.globalData.url + 'login',
					method: 'post',
					data: {code:that.code,phone:that.phone,uid:that.uid,name:that.name,img:that.img},
					success(res) {
						if (res.data.result == 1) {
							uni.setStorage({
								key: 'api_token',
								data: res.data.data
							});
							uni.setStorage({
								key: 'new',
								data: res.data.new
							});
							if (that.url) {
								uni.redirectTo({
									url: that.url,
									fail() {
										uni.reLaunch({
											url: that.url
										})
									}
								})
							} else {
								uni.reLaunch({
									url: '/pages/index/index'
								})
							}
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	@import "uview-ui/index.scss";
	page{
		background-color: #fff;
	}
	.login{
		padding: 0 54rpx;
	}
	.logo{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.text{
		color: #120D26;
		font-size: 50rpx;
		font-weight: bold;
		padding-left: 65rpx;
		margin-bottom: 30rpx;
	}
	.row{
		border: 1rpx solid #e6e0e0;
		height: 109rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		border-radius: 12rpx;
		margin-bottom: 39rpx;
		background-color: #fff;
		position: relative;
	}
	
	.row button{
		height: 100rpx;
		line-height: 100rpx;
		color: #747688;
		background-color: #fff;
		font-size: 28rpx;
		margin: 0;
		padding: 0;
	}

	.row button::after {
	   border: none;
	}
	
	.row u-image{
		margin: 0 29rpx 0 34rpx;
	}
	
	u-avatar{
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		right: 20rpx;
		top: 50%;
		margin-top: -45rpx;
	}
	
	.login_in{
		width: 542rpx;
		height: 116rpx;
		border-radius: 13rpx;
		margin: 0 auto;
		position: relative;
	}
	
	.login_in button{
		background-color: #5668ff;
		color: #fff;
		font-size: 38rpx;
		height: 116rpx;
		line-height: 116rpx;
		font-weight: bold;
	}
	
	.login_in button::after{
		border: 0;
		color: #fff;
	}
	
	.login_in .ar{
		position: absolute;
		width: 60rpx;
		height: 60rpx;
		background: #4963f4 url('https://xcx.huitengzx.com/images/login_ar.png') no-repeat center center;
		background-size: 26rpx 26rpx;
		border-radius: 60rpx;
		right: 27rpx;
		top: 50%;
		margin-top: -30rpx;
	}
	
	.or{
		margin: 55rpx 0 100rpx 0;
		text-align: center;
		font-size: 32rpx;
		color: #9D9898;
	}
	
	.to_index{
		font-size: 32rpx;
		color: #120D26;
		text-align: center;
		padding-bottom: 100rpx;
	}
</style>
