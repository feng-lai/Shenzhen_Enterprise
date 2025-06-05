<template>
	<view>
		<page-meta>
			<navigation-bar/>
		</page-meta>
		<view class="status_bar"></view>
		<navigator url="/pages/index/index" hover-class="none" :style="'text-align: left; height:'+height+'px; line-height:'+height+'px; padding-left:20rpx; display: flex;'"><u-icon name="home" color="#fff" size="60"></u-icon></navigator>
		<view class="page2">
			<view class="title">分享有礼红包领不停</view>
			<view class="num">小微制造运营周年福利活动</view>
			<view class="content">
				<view class="red_bag">
					<image src="https://xcx.huitengzx.com/images/red_bag.jpg"></image>
				</view>
				<view class="text1">距离领取红包还差</view>
				<view class="text2">{{invite_info.num}}人</view>
				<view class="line"></view>
				<view class="time">结束倒计时<u-count-down :timestamp="invite_info.times" separator="zh" font-size="30"></u-count-down></view>
				<block v-if="invite_info.times <= 0">
					<button class="btns" v-if="invite_info.num">
						<text>已失效</text>
						<image src="https://xcx.huitengzx.com/images/icon.png"></image>
					</button>
					<view class="btns" v-if="invite_info.num == 0">
						<text>领取奖励</text>
						<image src="https://xcx.huitengzx.com/images/icon.png"></image>
					</view>
				</block>
				<block v-else>
					<button class="btns" v-if="invite_info.num" open-type="share">
						<text>继续分享</text>
						<image src="https://xcx.huitengzx.com/images/icon.png"></image>
					</button>
					<view class="btns" @click="tip()" v-if="invite_info.num == 0">
						<text >领取奖励</text>
						<image src="https://xcx.huitengzx.com/images/icon.png"></image>
					</view>
				</block>
			</view>
			<view class="lines"></view>
			<view class="bottom">
				<view>
					<view class="big">微信添加福利官领取红包</view>
					<view>TEL<text>:</text>13421336920</view>
					<view>邮箱<text>:</text>xwzz@huitengzx.com</view>
				</view>
				<view>
					<image src="https://xcx.huitengzx.com/images/codes.jpg" @click="view('https://xcx.huitengzx.com/images/codes.jpg')"></image>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				invite_id:'',
				user:'',
				back_time:'',
				back_to:'',
				invite_info:'',
				id:'',
				height:'',
				aid:''
			}
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function(res) {
			if (res.from === 'button') { // 来自页面内转发按钮
				
			}
			return {
				title: '分享有礼红包领不停', 
				path: '/pages/trend/detail?id=' + that.id + '&invite_id=' + that.user.id + '&aid=' + that.aid,
			};
		},
		methods: {
			tip(){
				that.$refs.uToast.show({
					title: '添加下方二维码的微信好友领奖',
					type: 'success',
					duration:5000
				})
			},
			get_invite_info(){
				uni.request({
					url:app.globalData.url+'activity/invite',
					data:{invite_id:that.invite_id,api_token:app.globalData.api_token,aid:that.aid},
					success(res) {
						that.invite_info = res.data.data
					}
				})
			},
			back(){
				if(that.back_to){
					uni.navigateBack()
				}
			},
			view(img){
				uni.previewImage({
					urls:[img]
				})
			},
			getInfo(){
				uni.request({
					url:app.globalData.url+'activity',
					data:{invite_id:that.invite_id,aid:that.aid},
					success(res) {
						that.back_time = res.data.data.closes
						that.is_new = res.data.data.is_new
						var t = setInterval(function(){
							if(that.back_time <= 0){
								that.back_to = 1
								clearInterval(t)
							}else{
								that.back_time--
							}
						},1000)
					}
				})
			},
			getUser() {
				var that = this
				uni.request({
					url: app.globalData.url + 'user/info',
					data: {
						api_token: app.globalData.api_token
					},
					success(res) {
						if (res.data.result == 1) {
							that.user = res.data.data
							that.get_invite_info()

						}
					}
				})
			},
			activity_user_save(){
				uni.request({
					url:app.globalData.url+'activity/user_save',
					method:'POST',
					data:{api_token:app.globalData.api_token,article_id:that.article_id,aid:that.aid},
					success(res) {
						
					}
				})
			},
			activity_user_help_save(){
				uni.getStorage({
					key:'new',
					success(e) {
						uni.request({
							url:app.globalData.url+'activity/user_help_save',
							method:'POST',
							data:{api_token:app.globalData.api_token,is_new:e.data,invite_id:that.invite_id,article_id:that.article_id,aid:that.aid},
							success(res) {
								
							}
						})
					}
				})
			},
			dingyue(){
				wx.requestSubscribeMessage({
					tmplIds: ['JxRm8vug5atWEExysoj0e7YWs2FwrYF-8uuVXPpKA0E','i6Vty2qpwIzHPZSwQAcAGLCFAfOSJU6ae6-rY8sJIbU'],
					complete() {
						that.activity_user_save()
					}
				})
			},
		},
		onLoad(e) {
			that = this
			that.invite_id = e.invite_id
			that.id = e.id
			that.aid = e.aid
			uni.setStorage({
				key: 'url',
				data: '/pages/activity/activity?invite_id='+that.invite_id+'&id='+that.id+'&aid='+that.aid,
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin2()
						that.getInfo()
						that.getUser()
						if(that.invite_id){
							that.activity_user_help_save()
						}
						
					})
				}
			})
		},
		onShow() {
			
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			that.height = parseInt(menuButtonInfo.height)
		},
	}
</script>
<style lang="scss">
	@import "uview-ui/index.scss";
	@import url('@/static/css/activity.css');
	page{
		background: #dc4626 url('https://xcx.huitengzx.com/images/invite1.png') no-repeat center;
		background-size: cover;
		text-align: center;
		color: #fff;
	}
	.status_bar {
	      height: var(--status-bar-height);
	      width: 100%;
		  color: #000000;
	}
</style>
