<template>
	<view>
		<swiper class="swiper" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration">
			<block v-for="(v,k) in banner" v-if="v.type == 2">
				<swiper-item>
					<navigator class="swiper-item uni-bg-red" hover-class="none"
						:url="'/pages/banner/banner?url='+v.url">
						<image :src="v.img" />
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<u-form :model="form" ref="uForm" class="form">
			<u-form-item label="项目名称 :" label-width="auto">
				<text>{{info.title}}</text>
			</u-form-item>
			<u-form-item label="项目状态 :" label-width="auto">
				<text>{{info.text}}</text>
			</u-form-item>
			<u-form-item label="项目有效期 : " label-width="auto" prop="price">
				<u-count-down :timestamp="info.times" separator="zh" font-size="40"></u-count-down>
			</u-form-item>
			<u-form-item label="项目押金 : " label-width="auto" prop="price">
				<text>{{info.source_change}}</text>元
				<block v-if="info.refund == 1">
					<view class="right" v-if="info.status == 4 && info.is_created">
						<button class="other_btn" @click="reback()">退回押金</button>
					</view>
				</block>
				<block v-if="info.refund == 2">
					<view class="right">
						<button class="other_btn" :disabled="true">已申请退回押金，审核中</button>
					</view>
				</block>
				<block v-if="info.refund == 3">
					<view class="right">
						<button class="other_btn" :disabled="true">已退</button>
					</view>
				</block>
			</u-form-item>
			<u-form-item label="项目内容 :" label-width="auto" prop="price">
				<text>{{info.desc}}</text>
				<view v-if="info.status == 3 && info.is_created" class="edit">
						<button class="other_btn" @click="edit(2)">编辑</button>
				</view>
			</u-form-item>
			<u-form-item label="项目附件 :" label-width="auto" prop="provide">
				<view class="files">
					<view class="row" v-for="(v,k) in info.file">
						<u-icon name="file-text" size="100" @click="open_file(v.file)" v-if="v.type == 2"></u-icon>
						<image :src="'https://xcx.huitengzx.com/storage/file/'+v.file" v-if="v.type == 1" @click="open_file(v.file)"></image>
					</view>
				</view>
				<view v-if="info.status == 3 && info.is_created" class="edit">
					<button class="other_btn" @click="edit(1)">编辑</button>
				</view>
			</u-form-item>
			<u-form-item label=" " label-width="auto">
				<view v-for="(v,k) in info.provide" v-if="v.type == 1">
					<text>{{v.name}}合作申请</text>
					<view class="uname" v-if="v.detail.length">
						<view class="row" v-for="(val,key) in v.detail">
							<view class="name" @click="chose_o(k,key)">{{val.name}}
								<block v-if="val.status == 2">(选定)</block>
							</view>
						</view>
					</view>
					<view class="uname" v-else>暂无加入者</view>
				</view>
			</u-form-item>
		</u-form>
		<swiper class="swiper" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration">
			<block v-for="(v,k) in banner" v-if="v.type == 3">
				<swiper-item>
					<navigator class="swiper-item uni-bg-red" hover-class="none"
						:url="'/pages/banner/banner?url='+v.url">
						<image :src="v.img"/>
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<u-popup v-model="show" mode="center">
			<view class="comfirm">
				<view class="title">合作申请</view>
				<u-form-item label="内容 :" label-width="auto">
					<text style="font-weight: bold;">{{showContent.desc}}</text>
				</u-form-item>
				<u-form-item label="附件 :" label-width="auto">
					<view class="files">
						<view class="row" v-for="(v,k) in showContent.file">
							<u-icon name="file-text" size="100" @click="open_file(v.file)" v-if="v.type == 2"></u-icon>
							<image :src="'https://xcx.huitengzx.com/storage/file/'+v.file" v-if="v.type == 1" @click="open_file(v.file)"></image>
						</view>
					</view>
				</u-form-item>
				<view style="padding-left: 20rpx; margin: 20rpx auto;" v-if="!already">
					<u-checkbox v-model="checks" label-disabled="false"><text @click="view()">《确定合作的协议》</text>
					</u-checkbox>
				</view>
				<view style="text-align: center; margin-top: 20rpx;">
					<button @click="submit()" class="other_btn" v-if="!already">确定合作</button>
					<button class="other_btn" :disabled="true" v-else>确定合作</button>
				</view>
				<view v-if="already">当前已经确认合作方，如要更改合作方请联系客服:QQ:{{customer.qq}} 微信:{{customer.wx}}</view>
			</view>
		</u-popup>
		<u-popup v-model="file_show" mode="center" :mask-close-able="false">
			<view class="comfirm">
				<u-form-item label="*项目图片(最多10个)" label-width="auto">
					<view class="files">
						<view class="row" v-for="(v,k) in file" v-if="file.length">
							<u-icon name="file-text" size="100" @click="open_file(v.file)" v-if="v.type == 2"></u-icon>
							<image :src="'https://xcx.huitengzx.com/storage/file/'+v.file" @click="open_file(v.file)" v-if="v.type == 1"></image>
							<view class="name">{{v.name}}</view>
							<view>
								<u-icon name="close" size="30" @click="delFile(k)"></u-icon>
							</view>
						</view>
						<u-icon name="camera" size="60" class="icon" @click="chose()"></u-icon>
					</view>
				</u-form-item>
				<view style="text-align: center; margin-top: 20rpx;">
					<button class="other_btn" @click="e_submit()">确定</button>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="desc_show" mode="center" :mask-close-able="false">
			<view class="comfirm">
				<u-form-item label="内容 :" label-width="auto" prop="price">
					<u-input type="textarea" v-model="desc" :auto-height="true" maxlength="1000" placeholder="最多1000字符"></u-input>
				</u-form-item>
				<view style="text-align: center; margin-top: 20rpx;">
					<button class="other_btn" @click="e_submit()">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				file_show: false,
				desc_show:false,
				show: false,
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				banner: [],
				info: '',
				id: '',
				file: [],
				price1: 0,
				price2: 0,
				total: 0,
				project_config: {},
				order_id: '',
				name: '',
				desc: '',
				showContent: '',
				checks: false,
				already: '',
				customer: ''
			}
		},
		onShareAppMessage(res) {
			
		},
		methods: {
			//退押金
			reback(){
				uni.request({
					url:app.globalData.url+'project/refund',
					method:'POST',
					data:{order_id:that.info.order_id,api_token:app.globalData.api_token},
					success(res) {
						if(res.data.result == 1){
							that.getInfo()
						}
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			//编辑
			edit(type) {
				if(type == 1){
					that.file_show = true
				}
				if(type == 2){
					that.desc_show = true
				}
			},
			e_submit(){
				console.log(that.file)
				if(!that.desc){
					uni.showToast({
						title:'请填写描述',
						icon:'none'
					})
					return;
				}
				if(!that.file.length){
					uni.showToast({
						title:'请上传项目图片',
						icon:'none'
					})
					return;
				}
				uni.request({
					url:app.globalData.url+'project/edit',
					method:'POST',
					data:{desc:that.desc,file:that.file,api_token:app.globalData.api_token,id:that.id,type:1},
					success(res) {
						if(res.data.result == 1){
							that.getInfo()
							that.file_show = false
							that.desc_show = false
						}
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			//确定合作
			submit() {
				if (!that.checks) {
					uni.showToast({
						title: '请勾选确定合作的协议',
						icon: 'none'
					})
					return;
				}
				uni.request({
					url: app.globalData.url + 'project/chose',
					method: 'POST',
					data: {
						id: that.showContent.id,
						ppid: that.showContent.ppid
					},
					success(res) {
						if (res.data.result == 1) {
							uni.showToast({
								title: '成功',
								icon: 'none'
							})
							that.getInfo()
							that.show = false
						}
					}
				})
			},
			chose_o(k, key) {
				that.showContent = that.info.provide[k].detail[key]
				that.checks = false
				that.show = true
				if (that.info.provide[k].status == 2) {
					that.already = 1
				}
			},
			over() {
				uni.request({
					url:app.globalData.url+'project/over',
					method:'POST',
					data:{id:that.id,api_token:app.globalData.api_token},
					success(res) {
						if(res.data.result == 1){
							that.getInfo()
						}
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			view() {
				uni.navigateTo({
					url: '/pages/agreement/agreement?type=1'
				})
			},
			open_file(file) {
				if (!that.IsPicture(file)) {
					uni.navigateTo({
						url: '/pages/docs/docs?data=' + file + '&type=2'
					})
				} else {
					uni.previewImage({
						urls: ['https://xcx.huitengzx.com/storage/file/' + file]
					})
				}
			},
			IsPicture(file) {
				//判断是否是图片 - strFilter必须是小写列举
				var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|.svg|"
				if (file.indexOf(".") > -1) {
					var p = file.lastIndexOf(".");
					var strPostfix = file.substring(p, this.length) + '|';
					strPostfix = strPostfix.toLowerCase();
					if (strFilter.indexOf(strPostfix) > -1) {
						return true;
					}
				}
				return false;
			},
			getInfo() {
				uni.request({
					url: app.globalData.url + 'project/detail',
					data: {
						id: that.id,
						api_token: app.globalData.api_token
					},
					success(res) {
						that.info = res.data.data
						that.customer = res.data.customer
						that.file = res.data.data.file
						that.desc = res.data.data.desc
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
			},
			chose: function() {
				var that = this;
				uni.chooseImage({
					count: 10,
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
							that.upload(tempFilePaths[i].path, tempFilePaths[i].name)
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
			upload(file, name) {
				var that = this
				if (that.file.length >= 10) {
					uni.showToast({
						title: '只能上传10个文件',
						icon: 'none'
					})
					return;
				}
				uni.showLoading()
				uni.uploadFile({
					url: app.globalData.url + 'upload_file',
					filePath: file,
					name: 'file',
					success(res) {
						let info = JSON.parse(res.data)
						if (info.result == 1) {
							that.file.push({
								file: info.data,
								name: '图片',
								type: info.type
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
		},
		onLoad(e) {
			that = this
			that.id = e.id
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
		},
		onShow() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			var that = this; //是否已登录
			uni.setStorage({
				key: 'url',
				data: '/' + page.route + '?id=' + that.id,
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin()
						that.getBanner()
						that.getInfo()
					})
				}
			})
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import url('@/static/css/project.css');

	.uname {
		display: flex;
		flex-wrap: wrap;

	}

	.uname .row {
		margin: 10rpx;
		text-align: center;
		justify-content: flex-start;
	}

	.uname image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100%;
	}

	.comfirm {
		padding: 20rpx;
		width: 700rpx;
	}

	.comfirm .title {
		text-align: center;
	}
</style>
