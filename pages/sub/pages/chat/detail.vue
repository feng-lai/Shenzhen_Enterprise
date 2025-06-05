<template>
	<view>
		<view class="code">
			<image :src="'https://xcx.huitengzx.com/storage/group/'+info?info.vis_code:''" :show-menu-by-longpress="true" @click="view_pic(info.vis_code)"></image>
			<view class="tip" v-if="!is_code">{{text}}</view>
		</view>
		<view class="btn" v-if="!is_code && info.is_ad && info.fee == 1">
			<button class="other_btn" @click="to_index()" v-if="info.not_join < info.group_join_day">回到首页</button>
			<button class="other_btn" @click="view_ad()" v-else>观看广告</button>
		</view>
		<view class="btn" v-if="!is_code && !info.is_fee && info.fee == 2">
			<button class="other_btn" @click="viewPayType()">支付费用</button>
		</view>
		<view class="btn" v-if="is_code">
			点击打开二维码，长按识别
		</view>
		<view class="content">
			<view>
				<view>{{info.min_time}}小时后失效</view>
				<view class="text">时间</view>
			</view>
			<view class="line"></view>
			<view>
				<view>{{info.num}}</view>
				<view class="text">人数</view>
			</view>
			<view class="line"></view>
			<view>
				<view>{{info.fee == 1?'免费':'vip'}}</view>
				<view class="text">类别</view>
			</view>
			<view class="line"></view>
			<view>
				<view>{{info.view}}</view>
				<view class="text">浏览</view>
			</view>
		</view>
		<view class="name">
			<view>群名：<text>{{info.name}}</text></view>
		</view>
		<view class="name">
			<view>介绍：<text>{{info.dsc}}</text></view>
		</view>
		<view class="name names">
			<view>标签：</view>
			<view class="tag">
				<text v-for="(v,k) in tag">{{v}}</text>
			</view>
		</view>
		<ad unit-id="adunit-184701a939853ff7"></ad>
		<u-popup v-model="showPay" mode="bottom" :closeable="true" close-icon-color="#fff">
			<view class="pay_info">
				<view class="top">
					<view>支付金额</view>
					<view class="price">{{project_config.group_fee}}元</view>
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
				id:'',
				info:'',
				videoAd :null,
				is_code:false,
				text:'',
				ad_id:'adunit-bcacea395ee0c554',
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
				showPay: false,
				payType:1,
				project_config:'',
				voucher:0,
				tag:''
			}
		},
		methods: { 
			to_index(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
			},
			view_pic(img){
				console.log(img)
				uni.previewImage({
					urls:['https://xcx.huitengzx.com/storage/group/'+img]
				})
			},
			viewPayType(){
				that.showPay = true
				if(parseInt(that.voucher) < (parseInt(that.project_config.group_fee)*that.project_config.rate)){
					that.payInfo[1].disabled = true
					that.payInfo[1].name = '点券不足'
				}
			},
			view_ad(){
				if (that.videoAd) {
					that.videoAd.show().catch(() => {
						// 失败重试
						that.videoAd.load()
						  .then(() => that.videoAd.show())
						  .catch(err => {
							uni.showToast({
								title:'失败'
							})
						})
					})
				}
			},
			getInfo(){
				uni.request({
					url:app.globalData.url+'group_code/read',
					data:{api_token:app.globalData.api_token,id:that.id},
					success(res) {
						uni.stopPullDownRefresh()
						if(res.data.result == -2){
							uni.navigateTo({
								url:'/pages/login/login'
							})
						}
						that.info = res.data.data
						that.tag = that.info.tag.split(',')
						if(that.info.is){
							that.is_code = true
						}else{
							if(that.info.fee == 1){
								if(that.info.is_ad){
									if(that.info.group_join_day < that.info.not_join){
										that.text = '观看广告解锁'+that.info.group_join_day+'个新群'
									}else{
										that.text = '今日群已加完，请更新后再来使用'
									}
								}else{
									that.is_code = true
								}
							}else{
								if(that.info.is_fee){
									that.is_code = true
								}else{
									that.text = '需要付费解锁!'
								}
							}
						}
						
					}
				})
			},
			check(id){
				uni.navigateTo({
					url:'/pages/chat/detail?id='+id
				})
			},
			getWallet(){
				that.$u.get('wallet', {api_token:app.globalData.api_token}).then(res => {
					that.voucher = res.data.voucher
					that.payInfo[1].voucher = res.data.voucher
				})
			},
			getConfig(){
				that.$u.get('project/config', {}).then(res => {
					that.project_config = res.data
				})
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
				that.$u.post('group_code/pay', {id:that.id,api_token:app.globalData.api_token,payType:that.payType}).then(res => {
					that.showPay=false
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					uni.requestPayment({
					    provider: 'wxpay',
					    timeStamp: res.payInfo.timeStamp,
					    nonceStr: res.payInfo.nonceStr,
					    package: res.payInfo.package,
					    signType: res.payInfo.signType,
					    paySign: res.payInfo.paySign,
					    success: function (res) {
							that.getInfo()
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
		},
		onPullDownRefresh(){
			that.getInfo()
			that.getWallet()
			that.getConfig()
		},
		onLoad(e) {
			that = this; //是否已登录
			that.id = e.id
			if(uni.createRewardedVideoAd){
				that.videoAd  = uni.createRewardedVideoAd({ adUnitId: that.ad_id })
				that.videoAd .onLoad(() => {
					console.log('配置成功')
				})
				that.videoAd .onError((err) => {
					console.log('onError event emit', err)
				})
				that.videoAd .onClose((res) => {
					// 用户点击了【关闭广告】按钮
					if (res && res.isEnded) {
					  // 正常播放结束，可以下发游戏奖励
					  uni.request({
					  	url:app.globalData.url+'group_code/ad',
						method:'POST',
						data:{api_token:app.globalData.api_token,id:that.id,ad_id:that.ad_id},
						success(res){
							that.getInfo()
						}
					  })
					  
					} else {
					  // 播放中途退出，不下发游戏奖励
					  
					}
				})
			}
			
		},
		onShow() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			uni.setStorage({
				key: 'url',
				data: '/' + page.route+'?id='+that.id,
				success: function() {
					app.isLogin().then(function() {
						app.checkLoginReback()
						that.getInfo()
						that.getWallet()
						that.getConfig()
					})
				}
			})
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	.code{
		height: 491rpx;
		background: url('https://xcx.huitengzx.com/images/code_bg.png') no-repeat;
		background-size: cover;
		position: relative;
		width: 100%;
	}
	.code image{
		position: absolute;
		width: 380rpx;
		height: 370rpx;
		left: 50%;
		margin-left: -190rpx;
		top: 120rpx;
		border-radius: 20rpx;
	}
	.code .tip{
		position: absolute;
		width: 380rpx;
		left: 50%;
		margin-left: -190rpx;
		line-height: 100rpx;
		background-color: #fff393;
		text-align: center;
		top:250rpx;
		font-size: 36rpx;
		font-weight: bold;
	}
	.btn{
		margin: 40rpx 0;
		display: flex;
		justify-content: center;
	}
	.content{
		display: flex;
		margin: 0 36rpx;
		border-radius: 20rpx;
		height: 138rpx;
		align-items: center;
		border: 2rpx solid #f2f2f2;
		justify-content: space-between;
		padding: 0 40rpx;
		text-align: center;
		color: #c30204;
	}
	.content .line{
		width: 3rpx;
		background-color: #e0e0e0;
		height: 50rpx;
	}
	.content .text{
		color: #767676;
		margin-top: 10rpx;
	}
	.name{
		margin: 20rpx 36rpx;
		color: #a49995;
		font-size: 30rpx;
	}
	.name text{
		color: #333;
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
	.names{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.name .tag{
		display: flex;
		justify-content: flex-start;
	}
	.name .tag text{
		background-color: #2BAF87;
		color: #fff;
		display: inline-block;
		height: 30rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		border-radius: 10rpx;
		border: 1rpx solid #f5f5f5;
		margin-left: 10rpx;
		margin-bottom: 10rpx;
		font-size: 24rpx;
	}
</style>