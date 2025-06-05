<template>
	<view>
		<view class="content">
			<video class="video" :src="info.url" :poster="info.img" :style="'margin-top: '+top+'px;'"></video>
			<view class="option">
				<text :class="vis == 1?'active':''" @click="chose(1)">视频</text>
				<text :class="vis == 2?'active':''" @click="chose(2)">讨论</text>
				<text class="num">{{info.comments}}</text>
			</view>
			<uni-icons type="arrowleft" size="26" color="#ffffff" class="icon" @click="back" :style="'top: '+top+'px;'">
			</uni-icons>
		</view>
		<view :class="['detail',details]">
			<view class="cate">
				<text>{{info.title}}</text>
			</view>
			<view class="dsc">
				{{info.desc}}
			</view>
			<block v-if="info.price">
				<block v-if="!info.pay">
					<view><u-divider>以下为付费内容(￥{{info.price}})</u-divider></view>
					<view style="text-align: center;padding: 20rpx 0;"><button class="other_btn" @click="viewPayType()">支付查看</button></view>
				</block>
				<block v-if="info.pay">
					<view><u-divider>以下为付费内容(￥{{info.price}})</u-divider></view>
					<rich-text class="desc" :nodes="info.fee"></rich-text>
					<view style="text-align: center;padding-bottom: 20rpx;" v-if="info.urls"><button class="other_btn" @click="copy()">一键复制网盘链接</button></view>
				</block>
			</block>
			<view class="opera">
				<view class="left">
					<uni-icons class="icon" type="chat-filled" size="20" color="#9c9fa8"></uni-icons>
					<text>{{info.comment}}人参与讨论</text>
				</view>
				<button class="right" open-type="share">
					<uni-icons class="icon" type="redo" size="20" color="#9c9fa8"></uni-icons>
				</button>
			</view>
			<view class="author">
				<view class="left">
					<image :src="info.profile_pic"></image>
				</view>
				<view class="left">
					<view class="name">{{info.name}}</view>
				</view>
				<view class="clear"></view>
			</view>
			<view class="recommend">
				<view class="title">为你推荐</view>
				<view class="entry">
					<block v-for="(v,k) in recommend">
						<navigator class="row" hover-class="none" :url="'/pages/video/video?id='+v.id">
							<image :src="v.img" mode="aspectFill"></image>
							<view class="text">{{v.title}}</view>
						</navigator>
					</block>
				</view>
			</view>
		</view>
		<view :class="['comDetail',comDetails]">
			<view class="contents" v-if="comment.length" style="padding-bottom: 100rpx;">
				<block v-for="(v,k) in comment">
					<view class="row">
						<view class="left">
							<image :src="v.profile_pic" />
						</view>
						<view class="right">
							<view class="name">{{v.name}}</view>
							<view class="desc">{{v.content}}</view>
							<view class="time">
								<view class="left">{{v.time}}</view>
								<view class="right">
									<image src="../../static/image/com.png" @click="toComment(v.id,v.uid,v.name)" />
								</view>
							</view>
							<view class="reply">
								<block v-for="(val,key) in v.child">
									<view class="row">
										<view class="left">
											<image :src="val.profile_pic" />
										</view>
										<view class="right">
											<view class="name">
												<text>{{val.name}}</text>
												<image src="../../static/image/to.png" />
												<text>{{val.to_uname}}</text>
											</view>
											<view class="desc">{{val.content}}</view>
											<view class="time">
												<view class="left">{{val.time}}</view>
												<view class="right">
													<image src="../../static/image/com.png"
														@click="toComment(val.pid,val.uid,val.name)" />
												</view>
											</view>
										</view>
										<view class="clear"></view>
									</view>
								</block>
							</view>
						</view>
						<view class="clear"></view>
					</view>
				</block>
			</view>
			<view v-else class="empty">当前还没有评论</view>
			<view class="input">
				<view class="title" v-if="toName">评论给{{toName}}{{info.user_id == toUid?'(作者)':''}}</view>
				<view class="row">
					<textarea @input="textarea" value="友善的评论是交流的起点" class="left" :focus="focus" @blur="blur"
						@click="toComment(0,info.uid,info.name)"></textarea>
					<view class="right" @click="commentSubmit()">发布</view>
				</view>
			</view>
		</view>
		<u-popup v-model="showPay" mode="bottom" :closeable="true" close-icon-color="#fff">
			<view class="pay_info">
				<view class="top">
					<view>支付金额</view>
					<view class="price">{{info.price}}元</view>
				</view>
				<view class="title">付费内容购买</view>
				<view class="type">支付方式</view>
				<u-radio-group v-model="payType" wrap="true">
					<u-radio @change="radioChange" v-for="(v,k) in payInfo" :name="v.type" :key="k"  :disabled="v.disabled">
						<image :src="'https://xcx.huitengzx.com/images/'+v.class+'.png'" style="width: 40rpx; height: 40rpx; vertical-align: middle; margin:0 5rpx"></image>{{v.name}}
					</u-radio>
				</u-radio-group>
				<view class="sub">
					<button class="new_pay" @click="pay()">立即付款</button>
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
				info: '',
				id: '',
				comDetails: '',
				comment: [],
				focus: false,
				details: 'details',
				vis: 1,
				num: 10,
				page: 1,
				recommend: [],
				cpage: 1,
				cnum: 10,
				toName: '',
				toUid: '',
				toPid: '',
				toContent: '',
				top: '',
				showPay:false,
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
				payType:1,
				voucher:0,
				project_config:''
			};
		},
		onLoad(e) {
			that = this
			that.id = e.id
			that.getConfig()
		},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onShow: function() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			var that = this; //是否已登录
			uni.setStorage({
				key: 'url',
				data: '/' + page.route + '?id=' + that.id,
				success: function() {
					app.isLogin().then(function() {
						that.getInfo()
						that.getWallet()
					})
				}
			})
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			that.top = menuButtonInfo.top
		},
		onReachBottom() {
			if (this.vis == 1) {
				this.getRecommend()
			} else {
				this.getComment()
			}
		},
		methods: {
			getWallet(){
				that.$u.get('wallet', {api_token:app.globalData.api_token}).then(res => {
					that.voucher = res.data.voucher
					that.payInfo[1].voucher = res.data.voucher
				})
			},
			viewPayType(){
				that.showPay = true
				if(parseInt(that.voucher) < (parseInt(that.total)*that.project_config.rate)){
					that.payInfo[1].disabled = true
					that.payInfo[1].name = '点券不足'
				}
			},
			radioChange(e) {
				that.payType = e
			},
			getConfig(){
				that.$u.get('project/config', {}).then(res => {
					that.project_config = res
				})
			},
			copy(){
				uni.setClipboardData({
				    data: that.info.urls,
				    success: function () {
				        uni.showToast({
				        	title:'成功',
							icon:'none'
				        })
				    }
				});
			},
			pay(){
				if(!app.globalData.api_token){
					uni.navigateTo({
						url:'/pages/login/login'
					})
					return;
				}
				if (!that.payType) {
					uni.showToast({
						title: '请选择支付方式',
						icon: 'none'
					})
					return;
				}
				uni.showLoading()
				uni.request({
					url:app.globalData.url+'order/pay',
					method:'post',
					data:{api_token:app.globalData.api_token,id:that.id,type:3,payType:that.payType},
					success(res) {
						if (res.data.result == 1) {
							if(that.payType == 2){
								that.getInfo()
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								that.showPay=false
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
							        that.getInfo()
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
			share() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 4,
					href: "https://m.maiiepay.com/#/pages/maiTrend/video/detail?id=" + this.id,
					title: this.info.desc,
					summary: this.info.desc,
					imageUrl: this.info.img,
					mediaUrl: this.info.url,
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			},
			//评论监听
			textarea(e) {
				this.toContent = e.detail.value
			},
			//评论提交
			commentSubmit() {
				if (!this.toContent) {
					uni.showToast({
						icon: 'none',
						title: '请填写评论内容'
					})
					return false
				}
				var that = this
				uni.request({
					url: app.globalData.url + 'video/comment/add',
					method: 'post',
					data: {
						content: that.toContent,
						pid: that.toPid,
						to_uid: that.toUid,
						bid: that.id,
						api_token: app.globalData.api_token
					},
					success(res) {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
						if (res.data.result == 1) {
							that.cpage = 1
							that.getComment()
						}
					}
				})
			},
			getComment() {
				var that = this
				uni.request({
					url: app.globalData.url + 'video/comment/entry',
					data: {
						page: that.cpage,
						num: that.cnum,
						id: that.id
					},
					success(res) {
						var content = that.comment
						//页码为1时
						if (that.cpage == 1) {
							content = [];
						}
						var comment = res.data.data
						that.comment = content.concat(comment)
						if (that.cpage <= res.data.lastPage) {
							that.cpage++
						}
					}
				})
			},
			blur() {
				this.toName = ''
				this.focus = false
			},
			getRecommend() {
				var that = this;
				uni.request({
					url: app.globalData.url + 'video/entry',
					data: {
						num: that.num,
						page: that.page
					},

					success(res) {
						let page = that.page;
						var content = that.recommend;
						if (res.data.result == 1) {
							if (page == 1) {
								content = [];
							}
							var data = res.data.data;
							if (page <= res.data.lastPage) {
								that.page++
							}
							that.recommend = content.concat(data)
						}
					},
					complete: function() {
						uni.hideLoading();
					}
				});
			},
			back() {
				uni.navigateBack()
			},
			blur() {
				this.toName = ''
				this.focus = false
			},
			chose(id) {
				this.vis = id
				if (id == 1) {
					this.comDetails = ''
					this.details = 'details'
				} else {
					this.comDetails = 'comDetails'
					this.details = ''
				}
			},
			getInfo() {
				uni.showLoading({
					title: '加载中'
				})
				var that = this
				uni.request({
					url: app.globalData.url + 'video/detail',
					data: {
						id: that.id,
						api_token: app.globalData.api_token
					},
					success: (res) => {
						if (res.data.result == 1) {
							that.info = res.data.data
							that.getRecommend()
							that.getComment()
						}
					},
					complete() {
						uni.hideLoading()
					}
				})
			},
			//去评论
			toComment(pid, toUid, toName) {
				app.checkLogin2()
				this.toUid = toUid
				this.toName = toName
				this.toPid = pid
				this.focus = true
			},
		},
		onShareAppMessage() {
			return {
				title: this.info.title,
				imageUrl: this.info.img,
				path: '/pages/video/video?id=' + this.id
			}

		},
	}
</script>


<style lang="scss">
	@import "uview-ui/index.scss";
	page {
		background-color: #ffffff;
	}

	.content {
		position: fixed;
		left: 0;
		width: 100%;
		border-bottom: 2rpx solid #f8f8f8;
		z-index: 2;
		top: 0;
		background-color: #ffffff;
	}

	.content .icon {
		position: absolute;
		z-index: 2;
		top: 20rpx;
		left: 20rpx;
	}

	.content .video {
		width: 750rpx;
		height: 410rpx;
		display: block;
	}

	.content .option {
		background-color: #ffffff;
		height: 75rpx;
		line-height: 75rpx;
		padding: 0 10rpx;
	}

	.content .option text {
		margin: 0 20rpx;
		font-size: 30rpx;
		color: #6d6d6d;
		display: inline-block;
		height: 50rpx;
		line-height: 50rpx;
		vertical-align: middle;
	}

	.content .option .num {
		margin: 0;
		font-size: 20rpx;
		color: #979ba4;
	}

	.content .option .active {
		color: #000000;
		border-bottom: 5rpx solid #6bcdfe;
	}

	.detail {
		display: none;
		margin-top: 550rpx;
		background-color: #ffffff;
		padding: 0 36rpx;
	}

	.details {
		display: block;
	}

	.detail .cate {
		color: #333333;
		font-size: 30rpx;
		font-weight: 600;
	}

	.detail .dsc {
		font-size: 24rpx;
		color: #9c9fa8;
		margin-top: 10rpx;
		line-height: 40rpx;
	}

	.opera {
		height: 46rpx;
		line-height: 46rpx;
		margin: 40rpx 0;
		font-size: 20rpx;
		color: #9c9fa8;
	}

	.opera text {
		margin-left: 13rpx;
		vertical-align: middle;
	}

	.opera .icon {
		vertical-align: middle;
	}

	.opera .right {
		margin-left: 60rpx;
	}

	.opera .right::after {
		border: 0;
	}

	.opera button {
		background-color: #ffffff;
		padding: 0;
		margin: 0;
	}

	.author {
		padding: 50rpx 0;
	}

	.author image {
		height: 94rpx;
		width: 94rpx;
		border-radius: 94rpx;
		margin-right: 20rpx;
		z-index: 1;
	}

	.author .left .name {
		margin-top: 7rpx;
		line-height: 50rpx;
		font-size: 25rpx;
		color: #333333;
		font-weight: 600;
	}

	.author .left .atten {
		font-size: 20rpx;
		color: #aaaeb4;
		line-height: 36rpx;
	}

	.author .right {
		height: 94rpx;
		line-height: 94rpx;
	}

	.author .right text {
		display: inline-block;
		height: 52rpx;
		border: 1rpx solid #e2e2e4;
		color: #9a9ea8;
		padding: 0 20rpx;
		border-radius: 28rpx;
		line-height: 52rpx;
		font-size: 20rpx;
		vertical-align: middle;
	}

	.comDetail {
		margin-top: 500rpx;
		padding-top: var(--status-bar-height);
		display: none;
	}

	.comDetail .input {
		display: none;
	}

	.comDetails .input {
		display: block;
	}

	.comDetails {
		display: block;
	}

	.comDetail>.title {
		height: 82rpx;
		line-height: 82rpx;
		border-bottom: 1rpx solid #e7e7e7;
		position: fixed;
		top: 0;
		display: none;
		width: 100%;
		background-color: #ffffff;
		z-index: 2;
	}

	.comDetails>.title {
		display: block;
	}

	.comDetail>.title image {
		height: 26rpx;
		width: 26rpx;
		margin-left: 42rpx;
	}

	.comDetail>.title text {
		color: #5a5a5a;
		font-size: 30rpx;
		margin-left: 43rpx;
	}

	.comDetail .content {
		padding-top: 82rpx;
		height: 100%;
		overflow: auto;
	}

	.comDetail .scrolltolower {
		height: 100%;
	}

	.comDetail .contents .row {
		padding-left: 30rpx;
		padding-top: 26rpx;
		border-bottom: 1rpx solid #d3d3d3;
	}

	.comDetail .contents .row .left {
		width: 80rpx;
	}

	.comDetail .contents .row .left image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 60rpx;
	}

	.comDetail .contents .row .right {
		width: 640rpx;
	}

	.comDetail .contents .row .right .name {
		line-height: 40rpx;
		font-size: 24rpx;
		color: #333333;
	}

	.comDetail .contents .row .right .desc {
		line-height: 48rpx;
		font-size: 26rpx;
		color: #999999;
	}

	.comDetail .contents .row .right .time {
		height: 90rpx;
		line-height: 90rpx;
	}

	.comDetail .contents .row .right .time .left {
		width: auto;
	}

	.comDetail .contents .row .right .time .right {
		width: auto;
		margin-right: 30rpx;
	}

	.comDetail .contents .row .right .time .right image {
		height: 30rpx;
		width: 30rpx;
	}

	.comDetail .contents .row .right .reply .row {
		border-top: 1rpx solid #d3d3d3;
		border-bottom: 0;
	}

	.comDetail .contents .row .right .reply .row .right {
		width: 530rpx;
	}

	.comDetail .contents .row .right .reply .row .right .name image {
		width: 10rpx;
		height: 10rpx;
		vertical-align: middle;
		margin: 0 10rpx;
	}

	.comDetail .contents .row .right .reply .row .right .time .right {
		width: auto;
	}

	.comDetail .input {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		border-top: 1rpx solid #d3d3d3;
	}

	.comDetail .input .title {
		border: none;
		height: 77rpx;
		line-height: 77rpx;
		font-size: 26rpx;
		color: #999999;
		padding-left: 60rpx;
	}

	.comDetail .input textarea {
		width: 550rpx;
		padding-left: 60rpx;
		height: 104rpx;
		line-height: 104rpx;
		font-size: 26rpx;
		colo: #333333;
	}

	.comDetail .input .right {
		height: 104rpx;
		line-height: 104rpx;
		width: 130rpx;
		text-align: center;
		font-size: 26rpx;
		background-color: #55acee;
		color: #FFFFFF;
	}

	.recommend .title {
		line-height: 65rpx;
		font-size: 28rpx;
		color: #333333;
	}

	.recommend .entry {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.recommend .entry .row {
		width: 216rpx;
		font-size: 28rpx;
		color: #333333;
		margin-bottom: 40rpx;
		margin-right: 15rpx;
	}

	.recommend .entry .row:nth-child(3n) {
		margin-right: 0;
	}

	.recommend .entry .row .text {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.recommend .entry .row image {
		width: 216rpx;
		height: 285rpx;
		border-radius: 15rpx;
	}

	.empty {
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
