<template>
	<view>
		<swiper class="swiper" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration">
			<block v-for="(v,k) in banner" v-if="v.type == 2">
				<swiper-item>
					<navigator class="swiper-item uni-bg-red" hover-class="none"
						:url="'/pages/banner/banner?url='+v.url">
						<image :src="v.img"/>
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<u-form :model="form" ref="uForm" class="form">
			<view v-if="step == 1">
				<u-form-item label="项目名称 : " label-width="auto">
					<text>{{info.title}}</text>
				</u-form-item>
				<u-form-item label="项目有效期 : " label-width="auto" prop="price">
					<u-count-down :timestamp="info.times" separator="zh" font-size="40"></u-count-down>
				</u-form-item>
				<u-form-item label="项目介绍 : " label-width="auto" prop="price">
					<text>{{info.desc}}</text>
				</u-form-item>
				<u-form-item label="附件 : " label-width="auto" prop="provide">
					<view class="files">
						<view class="row" v-for="(v,k) in info.file">
							<u-icon name="file-text" size="100" @click="open_file(v.file)" v-if="v.type == 2"></u-icon>
							<image :src="'https://xcx.huitengzx.com/storage/file/'+v.file" v-if="v.type == 1" @click="open_file(v.file)"></image>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="招募合作 : " label-width="auto">
					<view v-for="(v,k) in info.provide" v-if="v.type == 1" style="display: flex; align-items: center;">
						<text>{{v.name}} 预占投资总额 {{v.persent}}%</text>
						<!--  #ifndef  H5 -->
						<block v-if="!info.is_created">
							<button class="other_btn" style="margin-left: 20rpx;" @click="join(k)" v-if="v.status == 1 && !v.is && !info.join && info.times > 0">我要加入</button>
							<button class="other_btn" style="margin-left: 20rpx;" v-if="v.status == 1 && v.is" @click="to">已加入</button>
							<button class="other_btn" style="margin-left: 20rpx;" v-if="v.status == 2">已确定合作伙伴</button>
						</block>
						<!--  #endif -->
					</view>
				</u-form-item>
			</view>
			<view v-if="step == 2">
				<u-form-item :label="''+name+'合作要求 : '" label-width="auto">
					<text>{{desc1}}</text>
				</u-form-item>
				<u-form-item :label="'*'+name+'合作描述 : '" label-width="auto">
					<u-input v-model="desc" :placeholder="'请输入'+name+'合作描述'" type="textarea" cursor-spacing="100" />
				</u-form-item>
				<u-form-item label="*资料附件(最多10个)" label-width="auto">
					<view class="files">
						<view class="row" v-for="(v,k) in file" v-if="file.length">
							<u-icon name="file-text" size="100" @click="open_file(v.file)" v-if="v.type == 2"></u-icon>
							<image :src="'https://xcx.huitengzx.com/storage/file/'+v.file" @click="open_file(v.file)" v-if="v.type == 1"></image>
							<view>
								<u-icon name="close" size="30" @click="delFile(k)"></u-icon>
							</view>
						</view>
						<u-icon name="camera" size="60" class="icon" @click="chose()"></u-icon>
					</view>
				</u-form-item>
				<view class="tips">
					*重要提示：请合理估算项目总投资金额并设置项目所需资源的合作比例，为防止合作各方发布虚假信息和广告信息，合作各方需要按照比例支付押金和服务费，合作招募结束后在用户中心申请退回押金。服务费：项目发起{{project_config.month_cost}}元/月，项目加入{{project_config.join_cost}}元/次。
				</view>
				<view class="acount">
					<view style="text-align: center;">相关费用</view>
					<view>服务费:{{price1}}元</view>
					<view>押金<text style="color: red;">(招募结束后退回)</text>:{{price2}}元</view>
					<view>押金计算:{{sum}}</view>
					<view style="text-align: right; font-weight: bold; font-size: 36rpx;">共:<text
							style="color: red;">{{total}}</text>元</view>
				</view>
				<view style="padding-left: 20rpx;">
					<u-checkbox v-model="checkeds" label-disabled="false"><text @click="view()">《平台招募服务协议》</text></u-checkbox>
				</view>
				<view class="submit">
					<button @click="pre" class="other_btn button">上一步</button>
					<button @click="viewPayType" class="other_btn">提交</button>
				</view>
			</view>
		</u-form>
		<swiper class="swiper" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration" style="padding-bottom: 90rpx;">
			<block v-for="(v,k) in banner" v-if="v.type == 3">
				<swiper-item>
					<navigator class="swiper-item uni-bg-red" hover-class="none"
						:url="'/pages/banner/banner?url='+v.url">
						<image :src="v.img"/>
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<u-popup v-model="showPay" mode="bottom" :closeable="true" close-icon-color="#fff">
			<view class="pay_info">
				<view class="top">
					<view>支付金额</view>
					<view class="price">{{payPrice}}元<text>{{price_text}}</text></view>
				</view>
				<view class="title">项目加入支付</view>
				<view class="type">支付方式</view>
				<u-radio-group v-model="payType" wrap="true">
					<u-radio @change="radioChange" v-for="(v,k) in payInfo" :name="v.type" :key="k"  :disabled="v.disabled">
						<image :src="'https://xcx.huitengzx.com/images/'+v.class+'.png'" style="width: 40rpx; height: 40rpx; vertical-align: middle; margin:0 5rpx"></image>{{v.name}}
					</u-radio>
				</u-radio-group>
				<view class="sub">
					<button class="new_pay" @click="submit()">立即付款</button>
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
				show: false,
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				banner: [],
				desc1:'',
				step: 1,
				info: '',
				id: '',
				jId: '',
				file: [],
				price1: 0,
				price2: 0,
				total: 0,
				project_config: {},
				order_id: '',
				name: '',
				desc: '',
				checkeds: false,
				sum:'',
				showPay: false,
				payInfo: [{
						name: '微信支付',
						disabled: false,
						type: 1,
						price:0,
						class:'weixin-fill'
					},
					{
						name: '点券支付',
						disabled: false,
						type: 2,
						price:0,
						class:'red-packet-fill'
					},
				],
				payType:1,
				voucher:0,
				price_text:'',
				payPrice:0,
				interstitialAd:'',
			}
		},
		onShareAppMessage(res) {
			
		},
		methods: {
			getWallet(){
				that.$u.get('wallet', {api_token:app.globalData.api_token}).then(res => {
					that.voucher = res.data.voucher
				})
			},
			viewPayType(){
				if (!that.desc) {
					uni.showToast({
						title: '请填写' + that.name + '合作描述',
						icon: 'none'
					})
					return;
				}
				if (!that.file.length) {
					uni.showToast({
						title: '请至少上传一份附件',
						icon: 'none'
					})
					return;
				}
				if (!that.checkeds) {
					uni.showToast({
						title: '请勾选平台招募服务协议',
						icon: 'none'
					})
					return;
				}
				that.showPay = true
				if(parseInt(that.voucher) < (parseInt(that.total)*that.project_config.rate)){
					that.payInfo[1].disabled = true
					that.payInfo[1].name = '点券不足'
				}
				that.payInfo[0].price = that.total
				that.payInfo[1].price = that.price2
				that.payPrice = that.total
			},
			radioChange(e) {
				that.payType = e
				if(e == 1){
					that.payPrice = that.total
					that.price_text = ''
				}else{
					that.payPrice = that.price2
					that.price_text = '(点券抵扣服务费'+'￥'+that.price1+')'
				}
			},
			to(){
				
				uni.navigateTo({
					url:'/pages/mine/project_detail2?id='+that.id
				})
			},
			view(){
				uni.navigateTo({
					url:'/pages/agreement/agreement'
				})
			},
			//计算价格
			price_count() {
				//服务费
				that.price1 = that.project_config.join_cost
				//押金
				that.price2 = parseInt(that.info.price) * 10000 * parseInt(that.info.provide[that.jId].persent) / 100 * that.project_config.project_persent / 100
				that.price2 = that.price2.toFixed(2)
				that.sum = parseInt(that.info.price)+'万元 x '+ parseInt(that.info.provide[that.jId].persent) + '% x ' + that.project_config.project_persent + '% = ' + that.price2 +'元'
				that.total = parseFloat(that.price2) + parseInt(that.price1)
			},
			get_project_config() {
				uni.request({
					url: app.globalData.url + 'project/config',
					success(res) {
						that.project_config = res.data.data
					}
				})
			},
			join(id) {
				if (!app.globalData.api_token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				that.jId = id
				that.step = 2
				that.price_count()
				that.name = that.info.provide[id].name
				that.desc1 = that.info.provide[id].desc
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
						api_token:app.globalData.api_token
					},
					success(res) {
						that.info = res.data.data
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
			submit() {
				if (!that.payType) {
					uni.showToast({
						title: '请选择支付方式',
						icon: 'none'
					})
					return;
				}
				uni.request({
					url: app.globalData.url + 'project/provide/save',
					data: {
						id: that.info.provide[that.jId].id,
						desc: that.desc,
						api_token: app.globalData.api_token,
						total: that.total,
						price1: that.price1,
						price2: that.price2,
						file: that.file,
						pid:that.id,
						payType:that.payType
					},
					method: 'post',
					success(res) {
						that.order_id = res.data.order_id
						if (res.data.result == 1) {
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: res.data.payInfo.timeStamp,
								nonceStr: res.data.payInfo.nonceStr,
								package: res.data.payInfo.package,
								signType: res.data.payInfo.signType,
								paySign: res.data.payInfo.paySign,
								success: function(res) {
									uni.showToast({
										title: '成功',
										icon: 'none'
									})
									that.getInfo()
									that.step = 1
									that.showPay = false
									if (that.interstitialAd) {
									  that.interstitialAd.show().catch((err) => {
									    console.error(err)
									  })
									}
								},
								fail: function(err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});
						}
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
					}
				})
			},
			pre() {
				that.step = 1
			},
			chose: function() {
				var that = this;
				uni.chooseImage({
					count: 10,
					success(res) {
						console.log(res)
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
								name: name,
								type:info.type
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

		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(e) {
			that = this
			that.id = e.id
			if (wx.createInterstitialAd) {
			  that.interstitialAd = wx.createInterstitialAd({
					adUnitId:'adunit-f615cd138fbba936'
			  })
			  that.interstitialAd.onLoad(() => {
					console.log('success')
			  })
			  that.interstitialAd.onError((err) => {
					console.log('failed')
			  })
			}
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
						that.getBanner()
						that.getInfo()
						that.get_project_config()
						that.getWallet()
					})
				}
			})
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import url('@/static/css/project.css')
</style>
