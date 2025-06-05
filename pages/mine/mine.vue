<template>
	<view>
		<view class="top">
			<view class="left">
				<image :src="user.profile_pic"></image>
			</view>
			<view class="left">
				<view class="row">
					<view class="text">{{user.name}}</view>
					<navigator class="text status" v-if="user.auths == -1 && user.type == 1" hover-class="none"
						url="/pages/mine/auth">
						<image src="../../static/image/l1.png"
							style="width: 45rpx; height: 45rpx; margin-right: 10rpx;"></image><text>(普通用户)</text>
					</navigator>
					<navigator class="text status" v-if="user.auths == -1 && user.type == 2" hover-class="none"
						url="/pages/mine/auth">
						<image src="../../static/image/l2.png"
							style="width: 45rpx; height: 45rpx; margin-right: 10rpx;"></image><text>(高级用户)</text>
					</navigator>
					<navigator class="text status" v-if="user.auths == 1" hover-class="none"
						url="/pages/mine/auth">
						<image src="../../static/image/l3.png"
							style="width: 45rpx; height: 45rpx; margin-right: 10rpx;"></image><text>(认证用户)</text>
					</navigator>
				</view>
			</view>
			<navigator class="right" @click="dingyue(1)">
				<uni-icons type="chat" size="30"></uni-icons>
				<text style="position: absolute; top: 25rpx; right: -10rpx; color: #FFFFFF; background-color: red; border-radius: 100%; padding: 0 10rpx; height: 30rpx; line-height: 30rpx; font-size: 26rpx;" v-if="chat_num">{{chat_num}}</text>
			</navigator>
			<view class="clear"></view>
		</view>
		<view class="list" style="border-top: 20rpx solid #f5f5f5;">
			<navigator class="row" :url="'/pages/mine/card'" hover-class="none">我的名片</navigator>
			<!-- <button class="row" v-if="!user.phone" open-type="getPhoneNumber" @getphonenumber="getphonenumbers">我的名片</button> -->
			<navigator class="row" hover-class="none" url="/pages/mine/trend">我的意向</navigator>
			<navigator class="row" hover-class="none" url="/pages/footprint/footprint">我的足迹</navigator>
			<navigator class="row" hover-class="none" url="/pages/mine/auth">我的认证</navigator>
		</view>
		<!--<view class="cum">
			<view class="content">
				<view class="row">
					<uni-icons type="weixin" color="#ffffff" size="16"></uni-icons>
					<text>客服微信 : </text>
					<text>{{user.wx}}</text>
				</view>
				<view class="row">
					<uni-icons type="qq" color="#ffffff" size="16"></uni-icons>
					<text>客服qq : </text>
					<text>{{user.qq}}</text>
				</view>
			</view>
		</view>-->
		<view class="com" style="border-top: 20rpx solid #f5f5f5;">
			<view class="title">工具和服务</view>
			<view class="tool">
				<navigator class="left" hover-class="none" url="/pages/search/company">
					<view><u-icon name="search"></u-icon></view>
					<text class="text">搜索公司</text>
				</navigator>
				<!--<view class="left" @click="toWork()">
					<view><u-icon name="account"></u-icon></view>
					<text class="text">招聘工人</text>
				</view>-->
				<navigator class="left" hover-class="none" url="/pages/msg/msg">
					<view><u-icon name="email"></u-icon></view>
					<text class="text">短信推广</text>
				</navigator>
				<navigator class="left" hover-class="none" url="/pages/mine/project"> 
					<view><u-icon name="file-text"></u-icon></view>
					<u-badge type="error" count="有更新" :offset="[-20,20]" v-if="user.is_project"></u-badge>
					<text class="text">我的项目</text>
				</navigator>
				<navigator class="left" hover-class="none" url="/pages/mine/wallet">
					<view><u-icon name="bag"></u-icon></view>
					<text class="text">我的钱包</text>
				</navigator> 
				<view class="left" @click="toHp()">
					<view><u-icon name="home"></u-icon></view>
					<text class="text">企业主页</text>
				</view>
				<navigator class="left" hover-class="none" url="/pages/cs/cs">
					<view><u-icon name="server-man"></u-icon></view>
					<text class="text">我的客服</text>
				</navigator>
				<navigator class="left" hover-class="none" url="/pages/sub/pages/chat/chat">
					<view><u-icon name="weixin-fill"></u-icon></view>
					<text class="text">我的群聊</text>
				</navigator>
			</view>
		</view>
		<view class="com" style="border-top: 20rpx solid #f5f5f5;">
			<view class="title">推荐tag</view>
			<view class="tag">
				<block v-for="(v,k) in user.tag">
					<navigator class="text" hover-class="none" :url="'/pages/tag/tag?tag='+v.word">{{v.word}}</navigator>
				</block>
			</view>
		</view>
		<view class="com" style="padding-bottom: 100rpx; border-top: 20rpx solid #f5f5f5;">
			<view class="title">平台公司</view>
			<view class="entry">
				<block v-for="(v,k) in info">
					<navigator class="row" hover-class="none" :url="'/pages/company/company?id='+v.id">
						<view class="left img">
							<image :src="v.img" mode="aspectFit">
						</view>
						<view class="left">
							<view class="title">{{v.name}}</view>
							<view class="desc">联系人 : {{v.legal_representative}} <text style="margin-left: 20rpx;">电话 :{{v.tel_num}}</text></view>
							<view class="desc">行业 : {{v.industry}}</view>
							<view class="desc">tag : {{v.tag}}</view>
						</view>
						<view class="clear"></view>
					</navigator>
				</block>
				<view style="width: 100%;">
					<uni-load-more :status="more" :contentText="contentText"></uni-load-more>
				</view>
			</view>
		</view>
		<view class="nav">
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
			<navigator class="left" hover-class="none" url="/pages/project/project" open-type="redirect">
				<view class="img">
					<image src="../../static/image/issue.png"></image>
				</view>
				<view class="name">
					招募合作
				</view>
			</navigator>
			<navigator class="left" hover-class="none" url="/pages/contact/contact" open-type="redirect">
				<view class="img">
					<image src="../../static/image/contact.png"></image>
				</view>
				<view class="name">
					联系我们
				</view>
			</navigator>
			<view class="left active">
				<view class="img">
					<image src="../../static/image/mines.png"></image>
				</view>
				<view class="name">
					我的
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var that
	const app = getApp()
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				page: 1,
				num: 10,
				info: '',
				user: '',
				more: 'loading',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "如需更多数据，请联系“我的”页面的客服人员"
				},
				phone: '',
				tid: '',
				word: '',
				chat_num:0
			}
		},
		components: {
			uniLoadMore
		},
		onShareAppMessage() {

		},
		methods: {
			//type 1消息订阅 2短信模板审核订阅
			dingyue(type){
				let key = 'rLDEIFQYrkw_DS1TdHlTTucSJCD91z5YykiiCalA38U' 
				let url = '/pages/notice/notice'
				if(type == 2){
					key = '5K_7e9jbqoYIGyYfr3Kawt56MdzDHBe9gv2vDEn0YTc'
					url = '/pages/msg/msg'
				}
				wx.requestSubscribeMessage({
					tmplIds: [key],
					success(e){
						uni.navigateTo({
							url:url
						})
					}
				})
			},
			getNoticeNum(){
				var that = this
				uni.request({
					url:app.globalData.url+'notice/not_read/num',
					data:{api_token:app.globalData.api_token},
					success(res) {
						if(res.data.result == 1){
							that.chat_num = res.data.data
						}
					}
				})
			},
			toWork(){
				if(this.user.recruit == 1 || this.user.auths == 1 || this.user.type == 2){
					uni.navigateTo({
						url:'/pages/search/work'
					})
				}else{
					uni.showToast({
						title:'该功能需要联系我的主页客服人员开通权限',
						icon:'none'
					})
				}
			},
			toHp(){
				if(this.user.hp_status == 1){
					uni.navigateTo({
						url:'/pages/hp/hp?id='+that.user.id
					})
				}else{
					uni.showToast({
						title:'该功能需要联系我的主页客服人员开通权限',
						icon:'none'
					})
				}
			},
			choseTag(id, word) {
				this.more = 'loading'
				uni.showLoading({

				})
				if (this.tid == id) {
					this.tid = ''
					this.word = ''
				} else {
					this.tid = id
					this.word = word
				}

				this.page = 1
				this.getInfo()
			},
			getInfo() {
				var that = this
				uni.request({
					url: app.globalData.url + 'company/recommend',
					data: {
						page: that.page,
						num: that.num,
						tag: that.word,
						api_token:app.globalData.api_token
					},
					success(res) {
						that.contentText.contentnomore = res.data.more
						let page = that.page;
						var content = that.info; //页码为1时
						if (page == 1) {
							content = [];
						}
						var info = res.data.data; //后台请求拿到的结果
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.info = content.concat(info)
						that.page++
						if(info.length < that.num){
							that.more = 'noMore'
						}
						if(!res.data.data.length){
							that.more = 'noMore'
						}
					},
					complete() {
						uni.hideLoading()
					}
				})
			},
			getphonenumber(e) {
				var that = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									uni.request({
										url: app.globalData.url + 'user/phone',
										data: {
											api_token: app.globalData.api_token,
											code: loginRes.code,
											encryptedData: e.detail.encryptedData,
											iv: e.detail.iv
										},
										method: 'post',
										success() {
											that.getUser()
										}
									})
								}
							});
						}
					}
				});
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
						}
					}
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
						that.getInfo()
						that.getUser()
						that.getNoticeNum()
					})
				}
			})
		},
		onReachBottom() {
			this.getInfo()
		},
		onLoad() {
			that=this
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import url('@/static/css/mine.css')
</style>
