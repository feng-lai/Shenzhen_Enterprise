<template>
	<view>
		<view class="row">当前状态：{{info.text}} <block v-if="info.status == 2">(原因:{{info.reason}})</block></view>
		<view class="row">短信预览
			<view style="border: 1rpx solid #333333; padding: 10rpx;">
				{{info.content}}
			</view>
		</view>
		<view class="row">
			<view>免费发送测试(30分钟内只能发送一次测试)：</view>
			<view>
				<input type="text" maxlength="24" @input="ch_phone" :value="phone" placeholder="输入自己手机号测试"/>
				<button class="other_btn" style="vertical-align: middle; margin-left: 10rpx;" @click="send_test()">发送</button>
			</view>
		</view>
		<view class="row">
			<view>发送手机号：</view>
			<view><button class="other_btn" style="vertical-align: middle;" @click="match_phone()">匹配号码一键导入</button></view>
			<view v-if="m_phone.length" style="width:670rpx;"> 
				共匹配{{company.length}}家公司{{m_phone.length}}个手机号码
				<view class="right">
					<text style="border: 1rpx solid #000000; color: #000000; padding: 0 10rpx; display: inline-block; font-size: 22rpx; height: 40rpx; line-height: 40rpx; margin-right: 20rpx; border-radius: 10rpx;" @click="dels_group(5)">删除5个</text>
					<text style="border: 1rpx solid #000000; color: #000000; padding: 0 10rpx; display: inline-block; font-size: 22rpx; height: 40rpx; line-height: 40rpx; border-radius: 10rpx;" @click="dels_group(10)">删除10个</text>
				</view>
			</view>
			<scroll-view scroll-y="true" @scrolltolower="lower" class="phone" v-if="m_phone.length">
				<view v-for="(v,k) in m_phone" style="position: relative;">
					<navigator style="display: block;" hover-class="none" :url="'/pages/company/company?id='+v.id">
						{{v.name}}
					</navigator>
					<navigator style="display: block;" hover-class="none" :url="'/pages/company/company?id='+v.id">
						{{v.phone}}
					</navigator>
					<view style="position: absolute; top:  20rpx;right: 20rpx;">
						<uni-icons type="close" @click="dels(k)"></uni-icons>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="row">
			<view>自定义手机号(最多20个)<button class="other_btn" style="vertical-align: middle; margin-left: 10rpx;"
					@click="vis()">添加</button></view>
			<scroll-view scroll-y="true" class="phone" v-if="c_phone.length">
				<view v-for="(v,k) in c_phone">{{(k+1)+' : '+v}}
					<view class="right" style="padding-right: 30rpx;">
						<uni-icons type="close" @click="del(k)"></uni-icons>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="row">
			<view>发送信息(每条<text style="color: red;">￥{{cost}}</text>元)：</view>
			<view>共发送<text style="color: red;">{{num}}</text>条信息，花费<text style="color: red;">{{all}}元</text></view>
		</view>
		<view class="row">
			如有疑问请联系<text style="color:#479FF9"  @click="viss()">客服</text>
		</view>
		<view class="agree"><button class="other_btn" @click="showPay = true">确认</button></view>
		<e-modal :visible.sync="visible">
			<view class="model" style="padding: 20rpx; text-align: center; line-height: 80rpx;">
				<view><input type="text" placeholder="输入手机号" @input="add_phone" :value="input_phone"/></view>
				<view><button class="other_btn" @click="handleCancel()" style="margin-right: 20rpx;">返回</button><buttonclass="other_btn" @click="sub_phone()" type="primary">确定</button></view>
			</view>
		</e-modal>
		<u-popup v-model="showPay" mode="bottom" :closeable="true" close-icon-color="#fff">
			<view class="pay_info">
				<view class="top">
					<view>支付金额</view>
					<view class="price">{{all}}元</view>
				</view>
				<view class="title">短信发送费用购买</view>
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
	const app = getApp()
	var that
	export default {
		data() {
			return {
				scrollTop: '',
				info: '',
				id: '',
				content: '',
				name: '',
				phone: '',
				is: '',
				cum: {},
				visible: false,
				c_phone: [],
				m_phone: [],
				input_phone: '',
				num:0,
				cost:'',
				all:0,
				order_id:'',
				customer:{},
				company:'',
				payInfo: [{
						name: '微信支付',
						disabled: false,
						type: 1,
						class:'weixin-fill'
					},
				],
				payType:1,
				showPay:false,
				interstitialAd:'',
				isAd:false
			}
		},
		methods: {
			viss(){
				uni.navigateTo({
					url:'/pages/cs/cs'
				})
			},
			//计算数量
			send_cost(){
				that.num = parseInt(that.m_phone.length) + parseInt(that.c_phone.length)
				that.all = (that.num*that.cost).toFixed(2)
			},
			//发送测试号码
			send_test(){
				if(that.info.status != 1){
					uni.showToast({
						title: '请使用审核通过的短信模板发送信息',
						icon: 'none'
					})
					return false
				}
				if(!that.phone){
					uni.showToast({
						title:'请输入手机号',
						icon:'none'
					})
					return false;
				}
				if (!(/^1[34578]\d{9}$/.test(that.phone))) {
					uni.showToast({
						title:'无效手机号',
						icon:'none'
					})
					return false;
				}
				uni.request({
					url:app.globalData.url+'msg/send_test',
					data:{api_token:app.globalData.api_token,code:that.info.code,content:that.info.content,phone:that.phone},
					method:'post',
					success(res) {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			//匹配号码
			match_phone(){
				uni.showLoading()
				uni.request({
					url:app.globalData.url+'company/phone',
					data:{id:that.info.tid},
					success(res){
						if(res.data.result == 1){
							that.m_phone = res.data.data
							that.company = res.data.company
							that.send_cost()
						}
					},complete() {
						uni.hideLoading()
					}
				})
			},
			del(k){
				let res = []
				for(let i in that.c_phone){
					if(parseInt(k) != i){
						res.push(that.c_phone[i])
					}
				}
				that.c_phone = res
				that.send_cost()
			},
			dels(k){
				let res = []
				for(let i in that.m_phone){
					if(parseInt(k) != i){
						res.push(that.m_phone[i])
					}
				}
				that.m_phone = res
				that.send_cost()
			},
			dels_group(num){
				let arr = that.company.slice(0,num)
				that.company.splice(0,num)
				let phone = []
				for(let i in that.m_phone){
					if(arr.indexOf(that.m_phone[i].name) == -1){
						phone.push(that.m_phone[i])
					}
				}
				that.m_phone = phone
				that.send_cost()
			},
			sub_phone() {
				if(!that.input_phone){
					uni.showToast({
						title:'请输入手机号',
						icon:'none'
					})
					return false;
				}
				if (!(/^1[34578]\d{9}$/.test(that.input_phone))) {
					uni.showToast({
						title:'无效手机号',
						icon:'none'
					})
					return false;
				}
				if (that.c_phone.length >= 20) {
					uni.showToast({
						title: '最多添加20个自动定义号码',
						icon: 'none'
					})
					return;
				}
				for(let i in that.c_phone){
					if(that.c_phone[i] == that.input_phone){
						uni.showToast({
							title: '号码已存在',
							icon: 'none'
						})
						return;
					}
				}
				that.c_phone.push(that.input_phone)
				that.send_cost()
				that.visible = false
			},
			handleCancel() {
				that.visible = false
				that.input_phone = ''
			},
			vis() {
				that.visible = true
			},
			lower() {
				console.log(213)
			},
			ch_phone(e) {
				that.phone = e.detail.value
			},
			add_phone(e) {
				that.input_phone = e.detail.value
			},
			getInfo() {
				uni.request({
					url: app.globalData.url + 'msg/code/detail',
					data: {
						id: that.id,
						api_token: app.globalData.api_token
					},
					success(res) {
						if (res.data.result == 1) {
							that.info = res.data.data
							that.cost = res.data.cost
							that.customer = res.data.customer
						}
					}
				})
			},
			submit() {
				if(that.info.status != 1){
					uni.showToast({
						title: '请使用审核通过的短信模板发送信息',
						icon: 'none'
					})
					return false
				}
				if (!that.num) {
					uni.showToast({
						title: '发送短信数量不能为空',
						icon: 'none'
					})
					return false
				}
				uni.request({
					url: app.globalData.url + 'msg/order',
					method: 'post',
					data: {
						content: that.info.content,
						c_phone: that.c_phone,
						m_phone: that.m_phone,
						api_token: app.globalData.api_token,
						code:that.info.code
					},
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
							    success: function (res) {
									if(that.isAd){
										that.interstitialAd.show().catch((err) => {
										    that.sendDetail()
										})
									}else{
										that.sendDetail()
									}
							        
							    },
							    fail: function (err) {
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
			sendDetail(){
				uni.showLoading()
				var detail = setInterval(function(){
					uni.request({
						url:app.globalData.url+'msg/detail',
						data:{api_token:app.globalData.api_token,order_id:that.order_id},
						success(res) {
							if(res.data.result != -4){
								clearInterval(detail)
								uni.showToast({
									title:res.data.msg,
									icon:'none'
								})
								setTimeout(function(){
									uni.redirectTo({
										url:'/pages/msg/msg'
									})
								},1500)
							}
						}
					})
				},1500)
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
			  that.interstitialAd.onError((err) => {
					
			  })
			  that.interstitialAd.onClose(() => {
				that.sendDetail()
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
						app.checkLogin()
						that.getInfo()
					})
				}
			})
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	.row {
		line-height: 50rpx;
		padding: 30rpx 20rpx;
	}

	input {
		width: 450rpx;
		display: inline-block;
		vertical-align: middle;
		border: 1rpx solid #666666;
		height: 50rpx;
		line-height: 50rpx;
		text-align: left;
		padding-left: 10rpx;
	}

	.row text {
		color: #999999;
	}

	.agree {
		text-align: center;
		line-height: 50rpx;
		padding: 10rpx 20rpx;
	}

	.phone {
		max-height: 550rpx;
		overflow: scroll;
		border: 1rpx solid #cccccc;
		border-radius: 10rpx;
		padding: 10rpx;
		margin-top: 10rpx;
		width: 650rpx;
	}

	.phone view {
		padding: 10rpx 0;
		border-bottom: 1rpx solid #F5F5F5;
	}

	.phone .right {
		border: 0;
		padding: 0;
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
		margin: 0;
		border-radius: 0;
		text-align: center;
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
