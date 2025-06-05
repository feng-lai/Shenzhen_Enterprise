<template>
	<view>
		<view class="row">短信签名：小微制造</view>
		<view class="row" style="color: red;">
				禁止发送涉及：色情、赌博、毒品、党政、法律维权、众筹、慈善募捐、宗教、迷信、股票、留学移民、面试招聘、博彩、贷款、催款还款、信用卡提额、投资理财、中奖、抽奖、一元夺宝、一元秒杀、一元云购、二类电商、A货、烟酒、交友、暴力、恐吓、皮草、返现返利、代开发票、运营商禁止发送的信息、代理注册、代办证件、加群、加QQ或者加微信、贩卖个人信息、运营商业务、流量营销、违反广告法用语、殡葬、刷单、做任务、空包网、邀请好评、转店类、拉新、众包业务等内容的短信。
		</view>
		<view class="row">
			<view>模板一：</view>
			<view>业务需要寻找<input style="width: 510rpx; font-size: 24rpx;" type="text" maxlength="24" v-model="c_name" placeholder="输入你想要的产品或服务,严禁发送违法违规内容"/><text></text>供应商，如有意向请联系客服电话<input rtpw="text" maxlength="11" v-model="c_phone" placeholder="请输入您的手机号码" style="width: 220rpx; font-size: 24rpx;"><text></text>，回T退订。</view>
		</view>
		<view class="row">
			<view>示例：</view>
			<view>业务需要寻找<input style="width: 270rpx; font-size: 24rpx;" type="text" maxlength="24" disabled="true" placeholder="鼠标或电脑外设设计生产"/><text></text>供应商，如有意向请联系客服电话<input rtpw="text" maxlength="11" disabled="true" placeholder="13421336920" style="width: 160rpx; font-size: 24rpx;"><text></text>，回T退订。</view>
		</view>
		<view class="row">
			如需自定义短信群发或电话群呼请联系<text style="color:#479FF9"  @click="viss()">客服</text>
		</view>
		<view class="agree">
			<checkbox-group @change="check" style="display: inline-block;"><checkbox style="transform:scale(0.7)" name="check" value="1" color="#FFCC33"></checkbox></checkbox-group>
			同意<text @click="vis()" style="color: #479FF9;">《平台短信发送协议》</text>
		</view>
		<view class="agree"><button class="other_btn" @click="submit">提交审核</button></view>
		<e-modal :visible.sync="visible" @cancel="handleCancel">
			<view class="model" style="padding: 20rpx;">
				<rich-text :nodes="content"></rich-text>
			</view>
		</e-modal>
		<e-modal :visible.sync="visibles" @cancel="handleCancels">
			<view class="model" style="padding: 20rpx;">
				<rich-text :nodes="contents"></rich-text>
			</view>
		</e-modal>
	</view>
</template>

<script>
	const app = getApp()
	var that
	export default {
		data() {
			return {
				id: '',
				visible: false,
				c_name:'',
				c_phone:'',
				is:'',
				cum:{},
				num:2,
				content:'',
				contents:''
			}
		},
		methods: {
			handleCancel(){
				that.visible = false
			},
			vis(){
				that.visible = true
			},
			viss(){
				uni.navigateTo({
					url:'/pages/cs/cs'
				})
			},
			getAgree(){
				uni.request({
					url:app.globalData.url+'msg/agreement',
					success(e) {
						that.content = e.data.data
						that.contents = e.data.cum
					}
				})
			},
			check(e){
				that.is = e.detail.value[0]
			},
			submit(){
				if(!that.c_name){
					uni.showToast({
						title:'请填写产品或服务',
						icon:'none'
					})
					return false
				}
				if(!that.c_phone){
					uni.showToast({
						title:'请填写手机号码',
						icon:'none'
					})
					return false
				}
				if(!that.is){
					uni.showToast({
						title:'请勾选同意',
						icon:'none'
					})
					return false
				}
				wx.requestSubscribeMessage({
					tmplIds: ['5K_7e9jbqoYIGyYfr3Kawt56MdzDHBe9gv2vDEn0YTc'],
					success(e){
						uni.request({
							url:app.globalData.url+'msg/code/add',
							method:'post',
							data:{id:that.id,name:that.c_name,phone:that.c_phone,api_token:app.globalData.api_token,id:that.id},
							success(res) {
								if(res.data.result == 1){
									setTimeout(function(){
										uni.redirectTo({
											url:'/pages/msg/msg'
										})
									},1000)
								}
								uni.showToast({
									title:res.data.msg,
									icon:'none'
								})
							}
						})
					}
				})
				
			}
		},
		onLoad(e) {
			that = this
			that.id = e.id
			
		},
		onShow() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			var that = this; //是否已登录
			uni.setStorage({
				key: 'url',
				data: '/' + page.route+'?id='+that.id,
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin()
						that.getAgree()
					})
				}
			})
		}
	}
</script>

<style>
	.row {
		line-height: 50rpx;
		padding: 10rpx 20rpx;
	}
	input{
		width: 200rpx;
		display: inline-block;
		vertical-align: middle;
		margin: 0 10rpx;
		border: 1rpx solid #333333;
		padding: 0 10rpx;
	}
	.row text{
		color:#999999;
	}
	.agree{
		text-align: center;
		line-height: 50rpx;
		padding: 10rpx 20rpx;
	}
	textarea{
		border:1rpx solid #333;
		padding: 10rpx;
	}
	.text{
		display: flex;
		justify-content: space-between;
		color: #333;
	}
</style>
