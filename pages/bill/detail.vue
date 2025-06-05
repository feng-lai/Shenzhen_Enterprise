<template>
	<!--
	1点券购买 
	2账单支付 
	3短信发送支付 
	4项目发起支付 
	5项目加入支付 
	6项目押金退回 
	7点券退回成功
	8视频、文章、动态付费内容支付
	9名片收款
	10后台增加点券
	11后台减少点券
	12账单待支付
	13视频、文章、动态付费内容待支付
	14项目发起待支付
	15项目加入待支付
	16点券退回失败
	17点券退回申请
	18名片扫码付款
	22二维码解锁待付款
	-->
	<view>
		<view class="title" style="margin-top:50rpx;">{{bill.text}}</view>
		<view v-show="type == 2">
			<view class="status" v-if="bill.status == 1">状态:未支付</view>
			<view class="status" v-if="bill.status == 2">状态:已支付</view>
			<rich-text :nodes="bill.content"></rich-text>
		</view>
		<view class="price" v-if="bill.price" style="text-align: center;font-size: 36rpx;font-weight: bold;">￥:{{bill.price}}</view>
		<view class="price" v-if="bill.voucher" style="text-align: center;font-size: 36rpx;font-weight: bold;">点券:{{bill.voucher}}</view>
		<view class="pay" style="margin-top: 20rpx;">
			<button class="new_pay" @click="viewPayType" v-if="type == 12||type == 13||type == 14||type == 15||type == 22">立即付款</button>
		</view>
		<navigator class="content" v-if="content" style="padding: 20rpx; border: 1rpx solid #cccccc; margin: 70rpx 10rpx 10rpx 10rpx;" :url="content.link?content.link:''" hover-class="none">
			<view v-if="content.title" style="margin-bottom: 20rpx;">标题 : {{content.title}}</view>
			<rich-text :nodes="'内容 : '+content.content" v-if="content.content"></rich-text>
		</navigator>
		
		<u-popup v-model="showPay" mode="bottom" :closeable="true" close-icon-color="#fff">
			<view class="pay_info">
				<view class="top">
					<view>支付金额</view>
					<view class="price">{{bill.price}}元</view>
				</view>
				<view class="title">{{bill.text}}</view>
				<view class="type">支付方式</view>
				<u-radio-group v-model="payType" wrap="true">
					<u-radio @change="radioChange" v-for="(v,k) in payInfo" :name="v.type" :key="k"  :disabled="v.disabled">
						<image :src="'https://xcx.huitengzx.com/images/'+v.class+'.png'" style="width: 40rpx; height: 40rpx; vertical-align: middle; margin:0 5rpx"></image>{{v.name}}<block v-if="v.voucher">({{v.voucher}})</block>
					</u-radio>
				</u-radio-group>
				<view class="sub">
					<button size="medium" @click="submit()"  class="new_pay">立即付款</button>
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
				showPay: false,
				payInfo: [{
						name: '微信支付',
						disabled: false,
						type: 1,
						class:'weixin-fill',
						voucher:'',
					},
					{
						name: '点券抵扣',
						disabled: false,
						type: 2,
						voucher:'',
						class:'red-packet-fill'
					},
				],
				voucher:0,
				bill:'',
				project_config:'',
				type:1,
				payType:1,
				content:{},
				interstitialAd:'',
				isAd:false
			}
		},
		onShareAppMessage() {

		},
		methods: {
			viewPayType(){
				that.showPay = true
				if(parseInt(that.voucher) < (parseInt(that.bill.price)*that.project_config.rate)){
					that.payInfo[1].disabled = true
					that.payInfo[1].name = '点券不足'
				}
			},
			radioChange(e) {
				that.payType = e
			}, 
			submit(){
				if (!that.payType) {
					uni.showToast({
						title: '请选择支付方式',
						icon: 'none'
					})
					return;
				}
				uni.showLoading()
				let pay_url = 'bill/pay'
				let data = {id:that.id,api_token:app.globalData.api_token,payType:that.payType,text:that.content.type,cost:that.bill.price,order_id:that.bill.order_id,type:that.type};
				if(that.type == 13){
					pay_url = 'allBill/pay'
				}
				if(that.type == 14 || that.type == 15){
					pay_url = 'allBill/project_pay'
				}
				if(that.type == 22){
					pay_url = 'group_code/pay'
					data = {id:that.bill.gid,api_token:app.globalData.api_token,payType:that.payType}
				}
				that.$u.post(pay_url, data).then(res => {
					that.showPay=false
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					if(that.payType == 2 && that.type != 14 && that.type != 15){
						uni.navigateTo({
							url:'/pages/mine/wallet'
						})
						return
					}
					uni.requestPayment({
					    provider: 'wxpay',
					    timeStamp: res.payInfo.timeStamp,
					    nonceStr: res.payInfo.nonceStr,
					    package: res.payInfo.package,
					    signType: res.payInfo.signType,
					    paySign: res.payInfo.paySign,
					    success: function (res) {
							if (that.isAd) {
							  that.interstitialAd.show().catch((err) => {
							    console.error(err)
							  })
							}else{
								uni.navigateTo({
									url:'/pages/mine/wallet'
								})
							}
					    },
					    fail: function (err) {
					        console.log('fail:' + JSON.stringify(err));
					    } 
					});
				}).catch(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				})
			},
			getConfig(){
				that.$u.get('project/config', {}).then(res => {
					that.project_config = res.data
				})
			},
			getBill(){
				that.$u.get('allBill/detail', {id:that.id,api_token:app.globalData.api_token}).then(res => {
					that.bill = res.data
					that.content = res.data.detail
					that.type = res.data.type
				})
			},
			getWallet(){
				that.$u.get('wallet', {api_token:app.globalData.api_token}).then(res => {
					that.voucher = res.data.voucher
					that.payInfo[1].voucher = res.data.voucher
				})
			}
		},
		onLoad(e) {
			that = this
			that.id = e.id
			if (wx.createInterstitialAd) {
			  that.interstitialAd = wx.createInterstitialAd({
			    adUnitId: 'adunit-f615cd138fbba936'
			  })
			  that.interstitialAd.onLoad(() => {
				  that.isAd = true
			  })
			  that.interstitialAd.onError((err) => {})
			  that.interstitialAd.onClose(() => {
				  uni.navigateTo({
				  	url:'/pages/mine/wallet'
				  })
			  })
			}
		},
		onShow() {
			uni.setStorage({ 
				key: 'url',
				data: '/pages/bill/detail?id='+that.id,
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
	.title{
		text-align: center;
		line-height: 100rpx;
		font-size: 36rpx;
		font-weight: bold;
	}

	.pay{
		text-align: center;
	}
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
	}
	
	.pay_info .top .price{
		font-size: 60rpx;
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
