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
		<view style="padding:20rpx; border-bottom: 1rpx solid #e4e7ed; color: red;" v-if="step == 1">
			!项目必须含有现货产品、销售渠道才能发起合作</view>
		<u-form :model="form" ref="uForm" class="form">
			<view v-if="step == 1">
				<u-form-item label="*项目标题" label-width="auto" prop="title">
					<u-input v-model="form.title" placeholder="请输入项目标题(最多40个字符)" maxlength="40" />
				</u-form-item>
				<u-form-item label="*预估总投资(万元)" label-width="auto" prop="price">
					<u-input v-model="form.price" placeholder="上限5000万元" />
				</u-form-item>
				<u-form-item label="*资源分配" label-width="auto" prop="provide" style="border-bottom: 0;">
					<u-checkbox-group max="3">
						<u-checkbox v-model="item.checked" v-for="(item, index) in provide" :key="index"
							:name="item.name" :label-disabled="true">
							{{ item.name }}
							<u-icon name="minus-circle" v-if="item.is" @click="del(index)"></u-icon>
						</u-checkbox>
						<u-button @click="show_text(1)" size="mini" class="button" style="display: flex;">+</u-button>
					</u-checkbox-group>
					<view style="line-height: 30rpx;"></view>
				</u-form-item>
				<u-form-item style="color: red;">*添加您创建项目中所需要的资源并勾选您能在项目中提供的资源，未被勾选的资源将被分配到合作方</u-form-item>
				<u-form-item label="*发起方(我提供)" label-width="auto">
					<view v-for="(v,k) in provide" v-if="v.checked">
						{{v.name}}预占投资总额
						<u-input v-model="v.persent" class="line" placeholder=" " />%
					</view>
				</u-form-item>
				<u-form-item label="*合作方(我需要)" label-width="auto">
					<view v-for="(v,k) in provide" v-if="!v.checked">
						{{v.name}}预占投资总额
						<u-input v-model="v.persent" class="line" placeholder=" " />%
					</view>
				</u-form-item>
				<u-form-item label="*招募时间(月)" label-width="auto">
					<u-input v-model="form.time" placeholder="请输入招募时间(最少一个月)" type="number" />
				</u-form-item>
				<view class="submit">
					<button @click="next" class="other_btn">下一步</button>
				</view>
			</view>
			<view v-if="step == 2">
				<u-form-item label="*项目描述" label-width="auto" prop="desc">
					<u-input v-model="form.desc" placeholder="请输入项目描述(最多1000字符)" type="textarea" cursor-spacing="100"
						:border="true" maxlength="1000" :auto-height="true" />
				</u-form-item>
				<u-form-item label="*项目图片(最多10个)" label-width="auto">
					<view class="files">
						<view class="row" v-for="(v,k) in file" v-if="file.length">
							<image :src="'https://xcx.huitengzx.com/storage/file/'+v.file" @click="open_file(v.file)">
							</image>
							<view>
								<u-icon name="close" size="30" @click="delFile(k)"></u-icon>
							</view>
						</view>
						<u-icon name="camera" size="60" class="icon" @click="chose()"></u-icon>
					</view>
				</u-form-item>
				<u-form-item :label="'*'+v.name+'合作要求'" label-width="auto" :prop="'content'+k" v-for="(v,k) in provide"
					v-if="!v.checked">
					<u-input v-model="v.desc" placeholder="请输入合作要求(最多1000字符)" type="textarea" cursor-spacing="100"
						:border="true" maxlength="1000" :auto-height="true" />
				</u-form-item>
				<view class="tips">
					*重要提示：请合理估算项目总投资金额并设置项目所需资源的合作比例，为防止合作各方发布虚假信息和广告信息，合作各方需要按照比例支付押金和服务费，合作招募结束后在用户中心申请退回押金。服务费：项目发起{{project_config.month_cost}}元/月，项目加入{{project_config.join_cost}}元/次。
				</view>
				<view style="padding-left: 20rpx;">
					<u-checkbox v-model="checkeds" label-disabled="false"><text @click="view()">《平台招募服务协议》</text>
					</u-checkbox>
				</view>
				<view class="acount">
					<view style="text-align: center;">相关费用</view>
					<view>服务费:{{price1}}元</view>
					<view>押金<text style="color: red;">(招募结束后退回)</text>:{{price2}}元</view>
					<view>押金计算:</view>
					<view v-for="(v,k) in sum">{{v}}</view>
					<view style="text-align: right; font-weight: bold; font-size: 36rpx;">共:<text
							style="color: red;">{{total}}</text>元</view>
				</view>
				<view class="submit">
					<text @click="pre" class="other_btn" style="margin-right:20rpx">上一步</text>
					<text @click="viewPayType" class="other_btn">提交</text>
				</view>
			</view>
		</u-form>
		<swiper class="swiper" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration"
			style="padding-bottom: 90rpx;">
			<block v-for="(v,k) in banner" v-if="v.type == 3">
				<swiper-item>
					<navigator class="swiper-item uni-bg-red" hover-class="none"
						:url="'/pages/banner/banner?url='+v.url">
						<image :src="v.img" />
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<u-modal v-model="show" @confirm="add_text()">
			<u-input v-model="text" placeholder="请输入添加的内容" input-align="center" />
		</u-modal>
		<u-popup v-model="showPay" mode="bottom" :closeable="true" close-icon-color="#fff">
			<view class="pay_info">
				<view class="top">
					<view>支付金额</view>
					<view class="price">{{payPrice}}元<text>{{price_text}}</text></view>
				</view>
				<view class="title">项目招募支付</view>
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
				<navigator class="left" hover-class="none" url="/pages/project/entry" open-type="redirect">
					<view class="img">
						<image src="../../static/image/trend.png"></image>
					</view>
					<view class="name">
						招募动态
					</view>
				</navigator>
				<!--  #ifndef  H5 -->
				<view class="left active">
					<view class="img">
						<image src="../../static/image/issues.png"></image>
					</view>
					<view class="name">
						招募合作
					</view>
				</view>
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
			<!--  #ifdef  H5 -->
			<view style="text-align: center; background-color: #FFFFFF;height: 100rpx;line-height: 100rpx;">
				粤ICP备20055018号-2 </view>
			<!--  #endif -->
		</view>
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
				form: {
					title: '',
					price: '',
					time: '',
					desc: ''
				},
				step: 1,
				text: '',
				price_text:'',
				//1自定义我提供 2自定义我需要
				type: 1,
				provide: [{
						name: '现货产品',
						checked: false,
						persent: '',
						desc: '',
						is: ''
					},
					{
						name: '销售渠道',
						checked: false,
						persent: '',
						desc: '',
						is: ''
					}
				],
				file: [],
				price1: 0,//服务费
				price2: 0,//押金
				total: 0,
				project_config: {},
				order_id: 'H728770629870907',
				checkeds: false,
				sum: [],
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
				payPrice:0,
				interstitialAd:'',
				id:'',
				isAd:false
			}
		},
		onShareAppMessage(res) {

		},
		methods: {
			viewPayType(){
				if (!that.file.length) {
					uni.showToast({
						title: '请至少上传一份附件',
						icon: 'none'
					})
					return;
				}
				if (!that.form.desc) {
					uni.showToast({
						title: '请填写项目描述',
						icon: 'none'
					})
					return;
				}
				//需要
				let d = 1
				for (let i in that.provide) {
					if (!that.provide[i].desc && !that.provide[i].checked) {
						d = ''
					}
				}
				if (!d) {
					uni.showToast({
						title: '请全部补充完整好我需要的合作要求内容',
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
				if(parseInt(that.voucher) < (parseInt(that.price1)*that.project_config.rate)){
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
			del(k) {
				uni.showModal({
					title: '是否删除',
					success: function(res) {
						if (res.confirm) {
							let data = []
							for (let i in that.provide) {
								if (i != k) {
									data.push(that.provide[i])
								}
							}
							that.provide = data
						}
					}
				});
			},
			view() {
				uni.navigateTo({
					url: '/pages/agreement/agreement'
				})
			},
			//计算价格
			price_count() {
				//服务费
				that.price1 = that.project_config.month_cost * that.form.time
				that.price2 = 0
				that.sum = []
				//押金
				for (let i in that.provide) {
					if (that.provide[i].checked) {
						let price = parseInt(that.form.price) * 10000 * parseInt(that.provide[i].persent) / 100 / 100 *
							that.project_config.project_persent
						that.sum.push(that.provide[i].name + ':' + parseInt(that.form.price) + '万元 x ' + parseInt(that
								.provide[i].persent) + '% x ' + that.project_config.project_persent + '% = ' + price +
							'元')
						that.price2 = price + that.price2
					}
				}
				that.price2 = that.price2.toFixed(2)
				that.total = parseFloat(that.price2) + parseInt(that.price1)
				that.payPrice = that.total
			},
			get_project_config() {
				uni.request({
					url: app.globalData.url + 'project/config',
					success(res) {
						that.project_config = res.data.data
					}
				})
			},
			set_persent(e) {
				let k = e.currentTarget.dataset.k

				let val = e.detail.value

				for (let i in that.provide) {
					if (i == k) {
						that.provide[i].persent = val
					}
				}

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
								name: name
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
				uni.showLoading()
				if(that.type == 2){
					
					return;
				}
				uni.request({
					url: app.globalData.url + 'project/save',
					data: {
						title: that.form.title,
						price: that.form.price,
						desc: that.form.desc,
						time: that.form.time,
						file: that.file,
						provide: that.provide,
						api_token: app.globalData.api_token,
						total: that.total,
						price1: that.price1,
						price2: that.price2,
						payType:that.payType
					},
					method: 'post',
					success(res) {
						uni.hideLoading()
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
									uni.request({
										url:app.globalData.url+'project_order/detail/'+that.order_id,
										success(rss) {
											if(rss.data.result == 1){ 
												that.id = rss.data.data.pid
												if(that.isAd){
													that.interstitialAd.show().catch((err) => {
													    uni.navigateTo({
													    	url: '/pages/project/detail?id='+that.id
													    })
													})
												}else{
													uni.navigateTo({
														url: '/pages/project/detail?id='+that.id
													})
												}
												
												
												
											}
										}
									})
									uni.showToast({
										title: '成功',
										icon: 'none'
									})
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
			next() {
				if (!that.form.title) {
					uni.showToast({
						title: '请填写项目标题',
						icon: 'none'
					})
					return;
				}
				if (!that.form.price) {
					uni.showToast({
						title: '请填写预估总资产',
						icon: 'none'
					})
					return;
				}
				if (that.form.price > 5000) {
					uni.showToast({
						title: '预估总资产最多填5000',
						icon: 'none'
					})
					return;
				}
				//提供
				let c = 1 //必选资源
				let p = 1
				let persent = 0
				let all = 0
				for (let i in that.provide) {
					if (that.provide[i].checked && i < 3) {
						c = ''
					}
					if (!that.provide[i].persent) {
						p = ''
					}
					if (that.provide[i].checked) {
						persent += parseInt(that.provide[i].persent)
					}
					if (that.provide[i].persent) {
						all += parseInt(that.provide[i].persent)
					}
				}
				if (c) {
					uni.showToast({
						title: '我提供的前两项资源必须选择一项',
						icon: 'none'
					})
					return;
				}
				if (!p) {
					uni.showToast({
						title: '请全部分配好发者方和合作方的资源百分比',
						icon: 'none'
					})
					return;
				}
				if (persent < 40) {
					uni.showToast({
						title: '发起者占比不能少于40%',
						icon: 'none'
					})
					return;
				}

				if (all != 100) {
					uni.showToast({
						title: '请合理分配完全部资源，即加起来为100%',
						icon: 'none'
					})
					return;
				}
				if (!that.form.time || that.form.time == 0) {
					uni.showToast({
						title: '请填写招募时间或招募时间要大于0',
						icon: 'none'
					})
					return;
				}
				that.step = 2
				that.price_count()
			},
			pre() {
				that.step = 1
			},
			show_text(type) {
				that.type = type
				that.show = true
			},
			getWallet(){
				that.$u.get('wallet', {api_token:app.globalData.api_token}).then(res => {
					that.voucher = res.data.voucher
				})
			},
			add_text() {
				if (that.text) {
					if (that.type == 1) {
						let num = 0
						let is = ''
						for (let i in that.provide) {
							if (!that.provide.checked) {
								num++
							}
							if (that.text == that.provide[i].name) {
								is = 1
							}
						}
						if (num == 5) {
							uni.showToast({
								title: '添加失败，合作方最多只能添加5项',
								icon: 'none'
							})
							return
						}
						if (!is) {
							that.provide.push({
								name: that.text,
								checked: false,
								persent: '',
								desc: '',
								is: 1
							})
						}
					}
				}
				that.text = ''
			},

		},

		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			that = this
			that.get_project_config()
			if (wx.createInterstitialAd) {
			  that.interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-f615cd138fbba936'
			  })
			  that.interstitialAd.onLoad(() => {
					that.isAd = true
			  })
			  that.interstitialAd.onError((err) => {
					
			  })
			  that.interstitialAd.onClose(() => {
				uni.navigateTo({
					url: '/pages/project/detail?id='+that.id
				})
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
						that.getBanner()
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
