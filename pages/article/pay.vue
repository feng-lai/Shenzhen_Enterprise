<template>
	<u-popup v-model="showPay" mode="bottom" :closeable="false" close-icon-color="#fff">
		<view class="pay_info">
			<view class="top">
				<view>
					<view>支付金额</view> 
					<view class="price">{{price}}元</view>
				</view>
			</view>
			<view class="title">付费内容购买</view>
			<view class="type">支付方式</view>
			<u-radio-group v-model="payType" wrap="true">
				<u-radio v-for="(v,k) in payInfo" :name="v.type" :key="k"  :disabled="v.disabled">
					<image :src="'https://xcx.huitengzx.com/images/'+v.class+'.png'" style="width: 40rpx; height: 40rpx; vertical-align: middle; margin:0 5rpx"></image>{{v.name}}<block v-if="v.voucher">({{v.voucher}})</block>
				</u-radio>
			</u-radio-group>
			<view class="sub">
				<button @click="pay()" type="error" class="new_pay">立即付款</button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				id:'',
				api_token:'',
				showPay:true,
				price:0,
				payType:1,
				payInfo: [{
						name: '微信支付',
						disabled: false,
						type: 1,
						voucher:'',
						class:'weixin-fill'
					},
					{
						name: '点券抵扣',
						disabled: false,
						type: 2,
						voucher:'',
						class:'red-packet-fill'
					},
				],
				interstitialAd:'',
				isAd:false,
				voucher:0
			}
		},
		onShareAppMessage(){
			
		},
		methods: {
			pay(){
				uni.request({
					url:app.globalData.url+'order/pay',
					method:'post',
					data:{api_token:that.api_token,id:that.id,type:2,payType:that.payType},
					success(res) {
						if (res.data.result == 1) {
							if(that.payType == 2){
								uni.showToast({
									title:'成功',
									icon:'none'
								})
								if(that.isAd){
									that.interstitialAd.show().catch((err) => {
									  uni.navigateTo({
									  	url:'/pages/article/detail?id='+that.id+'&api_token='+that.api_token
									  })
									})
								}else{
									setTimeout(function(){
										uni.navigateTo({
											url:'/pages/article/detail?id='+that.id+'&api_token='+that.api_token
										})
									},2000)
								}
								
								return
							}
							uni.requestPayment({
							    provider: 'wxpay',
							    timeStamp: res.data.payInfo.timeStamp,
							    nonceStr: res.data.payInfo.nonceStr,
							    package: res.data.payInfo.package,
							    signType: res.data.payInfo.signType,
							    paySign: res.data.payInfo.paySign,
							    success: function (res) {
									uni.showToast({
										title:'成功',
										icon:'none'
									})
									if(that.isAd){
										that.interstitialAd.show().catch((err) => {
										  uni.navigateTo({
										  	url:'/pages/article/detail?id='+that.id+'&api_token='+that.api_token
										  })
										})
									}else{
										setTimeout(function(){
											uni.navigateTo({
												url:'/pages/article/detail?id='+that.id+'&api_token='+that.api_token
											})
										},2000)
									}
							        
							    },
							    fail: function (err) {
							        uni.navigateTo({
							        	url:'/pages/article/detail?id='+that.id+'&api_token='+that.api_token
							        })
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
			back(){
				uni.navigateTo({
					url:'/pages/article/detail?id='+that.id+'&api_token='+that.api_token
				})
			},
			getWallet(){
				that.$u.get('wallet', {api_token:app.globalData.api_token}).then(res => {
					that.voucher = res.data.voucher
					that.payInfo[1].voucher = res.data.voucher
					that.$u.get('project/config', {}).then(ros => {
						console.log(ros)
						if(parseInt(that.voucher) < (parseInt(that.price)*ros.data.rate)){
							that.payInfo[1].disabled = true
							that.payInfo[1].name = '点券不足'
						}
					})
				})
			},
		},
		onShow(){
			
		},
		onLoad(e) {
			that = this
			that.id = e.id
			that.api_token = e.api_token
			that.price = e.price
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			uni.setStorage({
				key: 'url',
				data: '/' + page.route + '?id=' + e.id +'&api_token='+e.api_token+'&price='+e.price,
				success: function() {
					app.isLogin().then(function() {
						that.getWallet()
					})
				}
			})
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
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	.pay_info {
		height: 100vh;
		background-color: #f3f4f8;
	}
	
	.pay_info .top{
		height: 400rpx;
		background-color: #669bfb;
		color: #fff;
		text-align: center;
		padding-top: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.pay_info .top .price{
		font-size: 60rpx;
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
	
	.pay_info .type{
		height: 134rpx;
		line-height: 134rpx;
		margin-bottom: 20rpx;
		background-color: #fffbff;
		padding-left: 20rpx;
	}
	
	.pay_info .u-radio{
		height: 134rpx;
		line-height: 134rpx;
		margin-bottom: 20rpx;
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
