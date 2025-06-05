<template>
	<view>
		<view class="top">
			<navigator hover-class="none" url="/pages/search/search">
				<input type="" name="word" disabled="true" />
			</navigator>
		</view>
		<swiper class="swiper" :autoplay="autoplay" :interval="interval" :duration="duration">
			<block v-for="(v,k) in banner">
				<swiper-item>
					<view class="swiper-item uni-bg-red">
						<image :src="v.img" mode="aspectFill" />
					</view>
				</swiper-item>
			</block>
		</swiper>
		<view class="form">
			<view class="title">
				绑定你的企业
			</view>
			<form @submit="formSubmit">
				<view class="group">
					<view class="left text">公司名</view>
					<view class="left"><input name="name" :value="info?info.name:''" placeholder="请输入你的标题"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">营业执照</view>
					<view class="left">
						<button class="other_btn" @click="upload(1)">点击上传</button>(小于10M的图片，再次上传可更换图片)
						<view v-if="img1">
							<image :src="img1.src" mode="aspectFit" @click="view(img1.src)"></image>
						</view>
						<input name="business_license" :value="img1.name" style="display: none;" />
					</view>

					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">法人身份证</view>
					<view class="left">
						<button class="other_btn" @click="upload(2)">点击上传</button>(小于10M的图片，再次上传可更换图片)
						<view v-if="img2">
							<image :src="img2.src" mode="aspectFit" @click="view(img2.src)"></image>
						</view>
						<input name="id_card" :value="img2.name" style="display: none;" />
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">说明</view>
					<view class="left"><textarea :value="info?info.desc:''" name="desc"></textarea></view>
					<view class="clear"></view>
				</view>
				<view class="submit">
					<button form-type="submit" class="other_btn">提交</button>
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
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				banner: '',
				img1: {},
				img2: {},
				info: ''
			}
		},
		onShareAppMessage(){
			
		},
		methods: {
			view(img){
				uni.previewImage({
					urls:[img]
				})
			},
			getBanner() {
				var that = this
				uni.request({
					url: app.globalData.url + 'banner',
					success(res) {
						that.banner = res.data.data
					}
				})
			},
			getInfo() {
				var that = this
				uni.request({
					url: app.globalData.url + 'auths/detail',
					data: {
						id: that.id,
						api_token:app.globalData.api_token
					},
					success(res) {
						if (res.data.result == 1) {
							that.info = res.data.data
							that.img1.name = res.data.data.business_license
							that.img2.name = res.data.data.id_card
							that.img1.src = 'https://xcx.huitengzx.com/storage/company/'+res.data.data.business_license
							that.img2.src = 'https://xcx.huitengzx.com/storage/company/'+res.data.data.id_card
						}
					}
				})
			},
			/**
			 * 上传文件
			 * 
			 */
			upload: function(type) {
				var that = this;
				uni.chooseImage({
					success(res) {
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: app.globalData.url + 'upload_company',
							filePath: tempFilePaths[0],
							name: 'file',
							success(res) {
								let info = JSON.parse(res.data)
								if (info.result == 1) {
									if (type == 1) {
										that.img1 = info.data
									} else {
										that.img2 = info.data
									}
								}
								uni.showToast({
									title: info.msg,
									icon: 'none'
								})
							}
						});
					}

				});
			},
			//提交
			formSubmit: function(e) {
				var that = this
				var formdata = e.detail.value
				if (!formdata.name) {
					uni.showToast({
						title: '请填写公司名',
						icon: 'none'
					})
					return
				}
				if (!formdata.business_license) {
					uni.showToast({
						title: '请上传营业执照',
						icon: 'none'
					})
					return
				}
				if (!formdata.id_card) {
					uni.showToast({
						title: '请上传法人身份证',
						icon: 'none'
					})
					return
				}
				uni.showLoading()
				uni.request({
					url: app.globalData.url + 'auths/save',
					method: 'post',
					data: {
						api_token: app.globalData.api_token,
						name: formdata.name,
						business_license: formdata.business_license,
						id_card: formdata.id_card,
						desc: formdata.desc,
						id: that.id
					},
					success(res) {
						if (res.data.result == 1) {
							setTimeout(function() {
								uni.reLaunch({
									url: '/pages/mine/auth'
								})
							}, 1000)
						}
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
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
				data: '/' + page.route + '?id=' + that.id,
				success: function() {
					app.isLogin().then(function() {
						if (that.id) {
							that.getInfo()
						}
					})
				}
			})
		},
		onLoad(e) {
			this.id = e.id ? e.id : ''
		}
	}
</script>

<style>
	@import url('@/static/css/auth.css')
</style>
