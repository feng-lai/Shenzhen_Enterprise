<template>
	<view v-if="pay">
		<view style="text-align: center; font-weight: bold; margin: 100rpx 0;">支付成功{{price}}元给{{name}}</view>
		<navigator hover-class="none" url="/pages/index/index" open-type="redirect" style="text-align: center;"><button size="mini">返回首页</button></navigator>
	</view>
	<view v-else>
		<view style="text-align: center; font-weight: bold;">
			<view class="pay_info">
				<view class="top">
					<view>支付金额</view>
					<view class="price">{{price}}元</view>
				</view>
				<view class="sub">
					<button class="new_pay" @click="pays()">立即付款</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				id:'',
				price:'',
				pay:'',
				name:'',
				interstitialAd:''
			}
		},
		methods: {
			pays(){
				uni.request({
					url:app.globalData.url+'card/codeOrder',
					method:'POST',
					data:{id:that.id,price:that.price,api_token:app.globalData.api_token},
					success(res) {
						uni.requestPayment({
						    provider: 'wxpay',
						    timeStamp: res.data.payInfo.timeStamp,
						    nonceStr: res.data.payInfo.nonceStr,
						    package: res.data.payInfo.package,
						    signType: res.data.payInfo.signType,
						    paySign: res.data.payInfo.paySign,
						    success: function (ros) {
						        that.pay = 1
								that.name = res.data.user
								that.interstitialAd.show().catch((err) => {
								    
								})
						    },
						    fail: function (err) {
						        console.log('fail:' + JSON.stringify(err));
						    }
						});
					}
				})
			}
		},
		onLoad(e) {
			that= this
			that.id = e.id
			that.price = e.price
			if (wx.createInterstitialAd) {
			  that.interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-f615cd138fbba936'
			  })
			  that.interstitialAd.onLoad(() => {
			  })
			  that.interstitialAd.onError((err) => {
					
			  })
			  that.interstitialAd.onClose(() => {

			  })
			}
		},
		onShow(){
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			uni.setStorage({
				key: 'url',
				data: '/' + page.route+'?id='+that.id+'&price='+that.price,
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin()
					})
				}
			})
		},
	}
</script>

<style>
.pay_info {
	height: 100vh;
	background-color: #f3f4f8;
}

.pay_info .top{
	height: 200rpx;
	background-color: #669bfb;
	color: #fff;
	text-align: center;
	padding-top: 50rpx;
}

.pay_info .title{
	height:100rpx;
	line-height: 100rpx;
	background-color:#5f96f9;
	color: #fff;
	margin: 0;
	border-radius: 0;
	text-align: center;
}

.pay_info .top .price{
	font-size: 60rpx;
}

.pay_info .top .price text{
	font-size: 26rpx;
}

.pay_info .type{
	height: 134rpx;
	line-height: 134rpx;
	margin-bottom: 30rpx;
	background-color: #fffbff;
	padding-left: 20rpx;
}

.pay_info .u-radio{
	height: 134rpx;
	line-height: 134rpx;
	margin-bottom: 30rpx;
	background-color: #fffbff;
	padding-left: 20rpx;
}

.pay_info u-button{
	background-color: #669bfb;
}


.pay_info .sub {
	margin: 20rpx 0;
	text-align: center;
}

</style>
