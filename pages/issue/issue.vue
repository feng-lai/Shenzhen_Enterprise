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
						<image :src="v.img" mode="aspectFill" />
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<view class="form">
			<form @submit="formSubmit">
				<view class="group">
					<view class="left text">*选择意向</view>
					<view class="left">
						<radio-group name="type">
							<radio value="1" :checked="type == 1?'true':''">我需要</radio>
							<radio value="2" :checked="type == 2?'true':''">我提供</radio>
						</radio-group>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*选择分类</view>
					<view class="left">
						<radio-group name="cid">
							<radio value="1" :checked="cid == 1?'true':''">产品</radio>
							<radio value="2" :checked="cid == 2?'true':''">设备</radio>
							<radio value="3" :checked="cid == 3?'true':''">技术</radio>
							<radio value="4" :checked="cid == 4?'true':''">人工</radio>
							<radio value="5" :checked="cid == 5?'true':''">其他</radio>
						</radio-group>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*你的标题</view>
					<view class="left" style="position: relative;">
						<textarea placeholder="请输入你的标题" :value="title" name="title" @input="titleInput" style="padding-bottom: 0rpx; height: 60rpx;" cursor-spacing="50"></textarea>
					</view>
					<view class="clear"></view>
					<view>
						<view class="right">{{titleNum}}/40</view>
						<view class="clear"></view>
					</view>
				</view>
				<view class="group" @click="aFcus()">
					<view class="left text">*描述</view>
					<view class="left">
						<textarea cursor-spacing="50" name="content" maxlength="6000" :value="content" auto-height="true" :focus="textF" @blur="blurt" @input="textarea"></textarea>
					</view>
					<view class="clear"></view>
					<view>
						<view class="right">{{num}}/6000</view>
						<view class="clear"></view>
					</view>
				</view>
				<view class="group">
					<view class="left text">附件</view>
					<view class="left">
						<view><button class="other_btn" @click="chose()">点击上传</button></view>
						<view v-if="file.length">
							<block v-for="(v,k) in file">
								<view class="row" style="border-bottom: 1rpx solid #f5f5f5; line-height: 45rpx; padding-bottom: 30rpx;">
									<view style="height: 100rpx;">
										<image :src="'https://xcx.huitengzx.com/storage/file/'+v.new" width="100" height="100" mode="aspectFit" @click="view('https://xcx.huitengzx.com/storage/file/'+v.new)"></image>
									</view>
									<view><button @click="delFile(k)" class="other_btn">删除</button></view>
								</view>
							</block>
							<view class="clear"></view>
						</view>
						<input name="file" :value="file" style="display:none;" />
					</view>
					<view class="clear"></view>
					<view style="line-height: 50rpx;">*图片少于10M,至少上传1张最多3张</view>
				</view>
				<view class="group">
					<view class="left text" style="text-align: right;">*产品关键字1 : </view>
					<view class="left"><input type="text" placeholder="至少填写1个关键字，例如制氧机" name="tag1" cursor-spacing="50"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text" style="text-align: right;">产品关键字2 : </view>
					<view class="left"><input type="text"  name="tag2" cursor-spacing="50"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text" style="text-align: right;">产品关键字3 : </view>
					<view class="left"><input type="text"  name="tag3" cursor-spacing="50"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*联系人</view>
					<view class="left"><input type="text" placeholder="请输入联系人" name="name" cursor-spacing="50"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*联系电话</view>
					<view class="left"><input type="text" placeholder="请输入联系电话" name="phone"></view>
					<view class="clear"></view>
				</view>
				<view class="submit">
					<button form-type="submit" class="other_btn">确认</button>
				</view>
				<ad unit-id="adunit-afd7e2207a169dde"></ad>
				<view style="height: 100rpx;"></view>
			</form>
		</view>
		<view class="nav">
			<navigator class="left" hover-class="none" url="/pages/index/index" open-type="redirectTo">
				<view class="img">
					<image src="../../static/image/index.png"></image>
				</view>
				<view class="name">
					首页
				</view>
			</navigator>
			<navigator class="left" hover-class="none" url="/pages/project/entry" open-type="redirectTo">
				<view class="img">
					<image src="../../static/image/trend.png"></image>
				</view>
				<view class="name">
					招募合作
				</view>
			</navigator>
			<view class="left active">
				<view class="img">
					<image src="../../static/image/issues.png"></image>
				</view>
				<view class="name">
					发布
				</view>
			</view>
			<navigator class="left" hover-class="none" url="/pages/contact/contact" open-type="redirectTo">
				<view class="img">
					<image src="../../static/image/contact.png"></image>
				</view>
				<view class="name">
					联系我们
				</view>
			</navigator>
			<navigator class="left" hover-class="none" url="/pages/mine/mine" open-type="redirectTo">
				<view class="img">
					<image src="../../static/image/mine.png"></image>
				</view>
				<view class="name">
					我的
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				//文件
				file: [],
				//联系人
				name: '',
				//电话
				phone: '',
				//内容
				content: '',
				//分类
				cid: '',
				//类型
				type: '',
				//标题
				title: '',
				banner: '',
				num: 0,
				titleNum:0,
				textF: false,
				word:'',
				interstitialAd:'',
				isAd:false
			}
		},
		onShareAppMessage(){
			
		},
		onLoad() {
			that = this
			if (wx.createInterstitialAd) {
			  that.interstitialAd = wx.createInterstitialAd({
			    adUnitId: 'adunit-edb5405ed2405dea'
			  })
			  that.interstitialAd.onLoad(() => {
				  that.isAd = true
			  })
			  that.interstitialAd.onError((err) => {})
			  that.interstitialAd.onClose(() => {
				  uni.redirectTo({
				  	url:'/pages/trend/trend'
				  })
			  })
			}
		},
		methods: {
			aFcus() {
				this.textF = true
			},
			blurt() {
				this.textF = false
			},
			view(img){
				uni.previewImage({
					urls: [img],
					
				});
			},
			/**
			 * 上传文件
			 * 
			 */
			chose: function(e) {
				var that = this;
				uni.chooseImage({
					count: 3,
					success(res) {
						const tempFilePaths = res.tempFiles;
						for (let i in tempFilePaths) {
							if (tempFilePaths[i].size > 10485760) {
								uni.showToast({
									title: '文件超出10M,上传失败',
									icon: 'none'
								})
								return;
							}
							that.upload(tempFilePaths[i].path, '图片', 'image')
						}
					}

				});
			},
			delFile(k) {
				var that = this
				uni.showModal({
					title: '是否删除',
					success: function(res) {
						if (res.confirm) {
							let data = []
							for (let i in that.file) {
								if (i != k) {
									data.push(that.file[i])
								}
							}
							that.file = data
						}
					}
				});
			},
			upload(file, name, type) {
				var that = this
				if(that.file.length >= 3){
					uni.showToast({
						title:'只能上传3个文件',
						icon:'none'
					})
					return;
				}
				uni.showLoading()
				uni.uploadFile({
					url: app.globalData.url + 'upload_file',
					filePath: file,
					name: 'file',
					success(res) {
						console.log(res)
						let info = JSON.parse(res.data)
						if (info.result == 1) {
							that.file.push({
								new: info.data,
								name: name,
								type: type
							})
						}
						uni.showToast({
							title: info.msg,
							icon: 'none'
						})
					},
					complete() {
						uni.hideLoading()
					}
				});
			},
			textarea(e) {
				this.num = this.text_count(e.detail.value)
				this.content = e.detail.value
				
				
			},
			titleInput(e) { 
				this.titleNum = this.text_count(e.detail.value)
				this.title = e.detail.value
			},
			text_count(str){
				let count = str.length;
				for (let i = 0; i < str.length; i++) {
					if (str.charCodeAt(i) > 255) {
						count++;
					}
				}
				return count;
			},
			formSubmit: function(e) {
				var that = this
				var formdata = e.detail.value
				if (!formdata.type) {
					uni.showToast({
						title: '请选择意向',
						icon: 'none'
					})
					return
				}
				if (!formdata.cid) {
					uni.showToast({
						title: '请选择分类',
						icon: 'none'
					})
					return
				}
				if (!formdata.title) {
					uni.showToast({
						title: '请填写标题',
						icon: 'none'
					})
					return
				}
				if(this.text_count(formdata.title) > 40){
					uni.showToast({
						title: '标题字数超出限制',
						icon: 'none'
					})
					return
				}
				if (!formdata.content) {
					uni.showToast({
						title: '请填写描述',
						icon: 'none'
					})
					return
				}
				if(this.text_count(formdata.content) > 6000){
					uni.showToast({
						title: '描述字数超出限制',
						icon: 'none'
					})
					return
				}
				if (!formdata.tag1) {
					uni.showToast({
						title: '请至少填写一个tag词',
						icon: 'none'
					})
					return
				}
				if (!formdata.name) {
					uni.showToast({
						title: '请填写联系人',
						icon: 'none'
					})
					return
				}
				if (!formdata.phone) {
					uni.showToast({
						title: '请填写联系电话',
						icon: 'none'
					})
					return
				}
				let tag = formdata.tag1
				if(formdata.tag2){
					tag += ','+formdata.tag2
				}
				if(formdata.tag3){
					tag += ','+formdata.tag3
				}
				uni.showLoading()
				uni.request({
					url: app.globalData.url + 'trend/save',
					method: 'post',
					data: {
						api_token: app.globalData.api_token,
						title: formdata.title,
						cid: formdata.cid,
						type: formdata.type,
						content: formdata.content,
						phone: formdata.phone,
						name: formdata.name,
						file: that.file,
						tag:tag
					},
					success(res) {
						var id = res.data.id
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
						if(res.data.result == -1){
							
							return;
						}
						if (res.data.result == 1 && formdata.type == 1) {
							uni.showModal({
								content: '系统找到到'+res.data.data+'家公司可能匹配你的需求，是否发送短信通知',
								success(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/msg/code_add?id='+id
										});
									} else {
										uni.navigateTo({
											url: '/pages/index/index'
										});
									}
								}
							});
						}
						if (res.data.result == 1 && formdata.type != 1) {
							if(that.isAd){
								if (that.interstitialAd) {
								  that.interstitialAd.show().catch((err) => {
								    console.error(err)
								  })
								}
							}else{
								uni.redirectTo({
									url:'/pages/trend/trend'
								})
							}
							
							
						}
						uni.hideLoading()
					}
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
					})
				}
			})
			uni.getStorage({
				key: 'to',
				success(res) {
					that.type = res.data.split(',')[0]
					that.cid = res.data.split(',')[1]
				}
			})
			uni.getStorage({
				key:'searchDefault',
				success(res){
					that.word = res.data
				}
			})
		},
	}
</script>

<style>
	@import url('@/static/css/issue.css')
</style>
