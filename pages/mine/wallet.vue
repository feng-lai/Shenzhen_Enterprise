<template>
	<view>
		<view class="title">
			<view>
				<view>当前点券</view>
				<text>{{all}}</text>
			</view>
		</view>
		<view class="buy">
			购买点券
		</view>
		<view class="row">
			<u-button size="mini" @click="chose_voucher(100)" :type="(type == 1 && voucher == 100) ?'success' :'default'">100</u-button>
			<u-button size="mini" @click="chose_voucher(500)" :type="(type == 1 && voucher == 500) ? 'success' :'default'">500</u-button>
			<u-button size="mini" @click="chose_voucher(1000)" :type="(type == 1 && voucher == 1000) ? 'success' :'default'">1000</u-button>
			<view class="other">
				<text>其他</text>
				<u-input v-model="voucher2" type="number" border="true" placeholder="输入点数" @input="change" height="50"/>
			</view>
		</view>
		
		<view class="submit">
			需要支付<text>{{price}}</text>元<button class="other_btn" @click="showPay=true">支付</button>
		</view>
		<u-line class="u-line" margin="20rpx" border-style="dotted"></u-line>
		<view class="refund" v-if="config.vis_refund == 1">
			<view class="input">
				<text>申请退回点券</text>
				<u-input v-model="refund" type="number" placeholder="输入点数" :border="true" height="50"/>
				<text style="margin-left: 20rpx;">点券</text>
			</view>
			<view class="input" style="margin-top: 30rpx;">
				请点击右侧按钮<button class="other_btn" @click="vo_refund()" style="margin-left: 20rpx;">退回</button>
			</view>
		</view>
		<u-line class="u-line" margin="20rpx" border-style="dotted"></u-line>
		<view class="bill">
			<u-card margin="20rpx" title="钱包记录">
				<view slot="body" v-if="bill.length">
					<scroll-view scroll-y="true" @scrolltolower="lower" class="content">
						<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0" v-for="(v,k) in bill">
							<navigator class="u-body-item-title u-line-2" hover-class="none" :url="'/pages/bill/detail?id='+v.id">
								<view>{{v.text}}</view>
								<view>{{v.num}}</view>
								<view>{{v.time}}</view>
							</navigator>
						</view>
						<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0" v-if="bill.length>=3">
							<view class="u-body-item-title u-line-2"><button class="other_btn" @click="view_all()" v-show="viewAll">显示全部</button></view>
						</view>
					</scroll-view>
				</view>
				<view slot="body" v-else>
					<u-empty mode="list" text="没有账单"></u-empty>
				</view>
			</u-card>
		</view>
		
		
		<u-popup v-model="showPay" mode="bottom" :closeable="true" close-icon-color="#fff">
			<view class="pay_info">
				<view class="top">
					<view>支付金额</view>
					<view class="price">{{price}}元</view>
				</view>
				<view class="title">点券购买</view>
				<view class="type">支付方式</view>
				<u-radio-group v-model="value" wrap="true">
					<u-radio @change="radioChange" v-for="(v,k) in payInfo" :name="v.type" :key="k"  :disabled="v.disabled">
						<image :src="'https://xcx.huitengzx.com/images/'+v.class+'.png'" style="width: 40rpx; height: 40rpx; vertical-align: middle; margin:0 5rpx"></image>{{v.name}}<block v-if="v.voucher">({{v.voucher}})</block>
					</u-radio>
				</u-radio-group>
				<view class="sub">
					<button  class="new_pay" @click="pay">付款</button>
				</view>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				voucher: '',
				voucher2: '',
				refund:'',
				config:'',
				bill:'',
				page:1,
				num:3,
				all:'',
				type:1,
				price:0,
				viewAll:true,
				showPay:false,
				payInfo: [{
						name: '微信支付',
						disabled: false,
						type: 1,
						voucher:'',
						class:'weixin-fill'
					}
				],
				value: 1,
				interstitialAd:'',
			}
		},
		onShareAppMessage() {

		},
		methods: {
			vo_refund(){
				if(!that.refund || that.refund == 0){
					uni.showToast({
						title:'请输入要退款的点数',
						icon:'none',
						duration:5000
					})
					return
				}
				if(that.refund > that.all){
					uni.showToast({
						title:'输入的点数不能大于账号剩余点数',
						icon:'none',
						duration:5000
					})
					return
				}
				uni.showLoading()
				that.$u.post('voucher/refund', {api_token:app.globalData.api_token,voucher:that.refund}).then(res => {
					that.$refs.uToast.show({
						title: '您提交的申请已经收到，1-2个工作日内将有工作人员联系您处理退款事宜。',
						type: 'success',
						duration:5000
					})
					that.getWallet()
				})
			},
			pay(){
				let voucher = ''
				switch(parseInt(that.type)){
					case 1:
						voucher = that.voucher
					break;
					case 2: 
						voucher = that.voucher2
					break;
				}
				if(!voucher){
					uni.showToast({
						title:'点券不能为空',
						icon:'none',
						duration:5000
					})
					return
				}
				uni.showLoading()
				that.$u.post('order/pay/voucher', {voucher:voucher,api_token:app.globalData.api_token}).then(res => {
					uni.requestPayment({
					    provider: 'wxpay',
					    timeStamp: res.data.timeStamp,
					    nonceStr: res.data.nonceStr,
					    package: res.data.package,
					    signType: res.data.signType,
					    paySign: res.data.paySign,
					    success: function (res) {
					        that.getWallet()
							uni.hideLoading()
							that.showPay = false
							that.interstitialAd.show().catch((err) => {
							    
							})
					    },
					    fail: function (err) {
					        console.log('fail:' + JSON.stringify(err));
					    },
					});
				})
			},
			sum(){
				switch(parseInt(that.type)){
					case 1:
						that.price = that.voucher/that.config.rate
						break;
					case 2:
						that.price = that.voucher2/that.config.rate
						break;
				}
			},
			change(e){
				that.type = 2
				that.sum()
			},
			chose_voucher(e){
				that.type = 1
				that.voucher = e
				that.voucher2 = ''
				that.sum()
			},
			lower: function(e) {
				if(!that.viewAll){
					that.getBill()
				}
				
			},
			getConfig(){
				that.$u.get('project/config', {}).then(res => {
					that.config = res.data
				})
			},
			view_all(){
				that.num = 9999
				that.page = 1
				that.getBill()
				that.viewAll = false
				uni.showLoading()
			},
			getBill(){
				that.$u.get('allBill/entry', {num:that.num,page:that.page,api_token:app.globalData.api_token}).then(res => {
					let page = that.page;
					var content = that.bill; //页码为1时
					if (page == 1) {
						content = [];
					}
					var info = res.data; //后台请求拿到的结果
					//如果请求的数据小于20  就提示没有更多数据 否则正在加载
					that.bill = content.concat(info)
					if (page <= res.lastPage) {
						that.page++
					}
				})
			},
			getWallet(){
				that.$u.get('wallet', {api_token:app.globalData.api_token}).then(res => {
					that.all = res.data.voucher
				})
			}
		},
		onLoad(e) {
			that = this
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
				
			  })
			}
		},
		onShow() {
			uni.setStorage({ 
				key: 'url',
				data: '/pages/mine/wallet',
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin()
						that.getConfig()
						that.getBill()
						that.getWallet()
					})
				}
			})
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import url('@/static/css/wallet.css')
</style>
