<template>
	<view>
		<view class="form">
			<view class="group">
				<view class="title">{{info.title}}</view>
				<rich-text class="desc" :nodes="info.content"></rich-text>
				<block v-if="info.price && info.price!=0">
					<block v-if="!info.pay">
						<view style="text-align: center;">——— 以下为付费内容,未支付(￥{{info.price}}) ———</view>
						<view style="text-align: center;padding: 20rpx 0;"><button class="other_btn" @click="viewPayType()">支付查看</button></view>
					</block>
					<block v-else>
						<view style="text-align: center;">——— 以下为付费内容,未支付(￥{{info.price}}) ———</view>
						<rich-text class="desc" :nodes="info.fee" :selectable='true'></rich-text>
						<view style="text-align: center;padding-bottom: 20rpx;" v-if="info.url"><button class="other_btn" @click="copy()">一键复制网盘链接</button></view>
					</block>
				</block>
			</view>
			<view class="group">
				<view class="left text">意向 : {{info.type}}</view>
				<view class="right">
					分类 : {{info.cid}}
				</view>
				<view class="clear"></view>
				<view class="left text">联系人 : {{info.contactName}}</view>
				<view class="right">联系电话 : {{info.phone}}</view>
				<view class="clear"></view>
				<view class="left text" v-if="info.tag" style="max-width: none;">
					tag : 
					<block v-for="(v,k) in info.tag.split(',')">
						<navigator hover-class="none" :url="'/pages/tag/tag?tag='+v" style="background-color: #2BAF87;color: #fff;display: inline-block; height:30rpx;line-height: 30rpx; padding: 0 20rpx; border-radius: 10rpx; border: 1rpx solid #f5f5f5; margin-left: 10rpx; margin-bottom: 10rpx;">{{v}}</navigator>
					</block>
				</view>
				<view class="clear" v-if="info.tag"></view>
			</view>
			<ad unit-id="adunit-466006a6827b1874"></ad>
			<block v-for="(v,k) in info.file">
				<view class="group" v-if="v.type == 'image'">
					<image :src="'https://xcx.huitengzx.com/storage/file/'+v.file" style="height: 710rpx; width: 710rpx;  vertical-align: middle;"
					 mode="aspectFit" @click="view(v.file)"></image>
				</view>
				<view class="group" v-if="v.type == 'file'">
					<image src="../../static/image/file.png" style="height: 710rpx; width: 710rpx;  vertical-align: middle;" mode="aspectFit"></image>
				</view>
				<view class="group" v-if="v.file">
					<view class="left text">附件 : {{v.type=='image'?'图片':'文件'}}</view>
					<view class="right">
						<button class="other_btn" @click="downLoad(v.file,v.type,k)" v-if="writePic">下载</button>
						<button class="other_btn" open-type="openSetting" @opensetting="opensetting" v-else>下载</button>
					</view>
					<view class="clear"></view>
					<view v-if="path[k].path" style="word-wrap: break-word;">下载成功,文件路径为{{path[k].path}}</view>
				</view>
			</block>
		</view>
		<view class="comment">
			<view class="title">评论</view>
			<view class="entry" v-if="info.commentNum">
				<block v-for="(v,k) in info.comment">
					<view class="row" @click="toComment(v.id,v.uid,v.name)">
						<view class="user">
							<image :src="v.profile_pic">
								<text>{{v.name}}</text>
						</view>
						<view class="content">{{v.content}}</view>
					</view>
				</block>
			</view>
			<view class="all" @click="visComDetail(1)">查看全部({{info.commentNum}})</view>
		</view>
		<view :class="['comDetail',comDetails]">
			<view class="title">
				<image src="../../static/image/close.png" @click="visComDetail()" />
				<text>全部评论</text>
			</view>
			<scroll-view @scrolltolower="btnCom" class="scrolltolower" scroll-y="true">
				<view class="content">
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
									<!--  #ifndef  H5 -->
									<view class="right">
										<uni-icons type="chat" size="18" color="#000000" @click="toComment(v.id,v.uid,v.name)"></uni-icons>
									</view>
									<!--  #endif -->
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
													<text>{{val.to_name}}</text>
												</view>
												<view class="desc">{{val.content}}</view>
												<view class="time">
													<view class="left">{{val.time}}</view>
													<!--  #ifndef  H5 -->
													<view class="right">
														<image src="../../static/image/com.png" @click="toComment(val.pid,val.uid,val.name)" />
													</view>
													<!--  #endif -->
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
			</scroll-view>
			<!--  #ifndef  H5 -->
			<view class="input">
				<view class="title" v-if="toName">评论给{{toName}}{{info.uid == toUid?'(作者)':''}}</view> 
				<view class="row">
					<textarea @input="textarea" cursor-spacing="100" :value="toContent" class="left" :focus="focus" @blur="blur" @click="toComment(0,info.uid,info.name)" style="text-align: center;" maxlength="18" :adjust-position="true"></textarea>
					<view class="right" @click="commentSubmit()"><button class="other_btn">发布</button></view>
				</view>
			</view>
			<!--  #endif -->
		</view>
		<u-popup v-model="showPay" mode="bottom" :closeable="true" close-icon-color="#fff">
			<view class="pay_info">
				<view class="top">
					<view>
						<view>支付金额</view>
						<view class="price">{{info.price}}元</view>
					</view>
				</view>
				<view class="title">付费内容购买</view>
				<view class="type">支付方式</view>
				<u-radio-group v-model="payType" wrap="true">
					<u-radio @change="radioChange" v-for="(v,k) in payInfo" :name="v.type" :key="k"  :disabled="v.disabled">
						<image :src="'https://xcx.huitengzx.com/images/'+v.class+'.png'" style="width: 40rpx; height: 40rpx; vertical-align: middle; margin:0 5rpx"></image>{{v.name}}<block v-if="v.voucher">({{v.voucher}})</block>
					</u-radio>
				</u-radio-group>
				<view class="sub">
					<button class="new_pay" @click="pay()">立即付款</button>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="show_act" mode="center" :closeable="false" :mask-close-able="false" width="600rpx"  height="auto">
			<view class="page1">
				<view class="title">{{activity.price}}元红包分享有礼</view>
				<view class="num">邀请{{activity.num}}位好友即可领取</view>
				<view class="invite">
					<button class="btns" open-type="share" @click="dingyue" v-if="api_token">
						<text>立即邀请</text>
						<image src="https://xcx.huitengzx.com/images/icon.png"></image>
					</button>
					<button class="btns"@click="to_login" v-else>
						<text>立即邀请</text>
						<image src="https://xcx.huitengzx.com/images/icon.png"></image>
					</button>
				</view>
				<view class="tip">{{back_time}}秒后可点击关闭</view>
				<view class="close" @click="act_close()">关闭窗口</view>
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
				id: '', 
				comDetails: '',
				info: '',
				page: 1,
				num: 10,
				cpage: 1,
				cnum: 10,
				reCommend: [],
				toName: '',
				toUid: '',
				toPid: '',
				toContent: '',
				comment: [],
				focus: false,
				writePic: 1,
				path:[],
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
				project_config:'',
				interstitialAd:'',
				is_new:'',
				back_time:'',
				back_to:'',
				show_time:'',
				show_act:false,
				api_token:'',
				invite_id:'',
				activity:'',
				aid:'',
				t:''
			}
		},
		methods: {
			to_login(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			copy(){
				uni.setClipboardData({
				    data: that.info.url,
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
				that.showPay = false
				uni.showLoading()
				uni.request({
					url:app.globalData.url+'order/pay',
					method:'post',
					data:{api_token:app.globalData.api_token,id:that.id,type:1,payType:that.payType},
					success(res) {
						if (res.data.result == 1) {
							if(that.payType == 2){
								that.getInfo()
								that.getWallet()
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
									that.getWallet()
									that.interstitialAd.show().catch((err) => {
									    
									})
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
			visComDetail: function(vis) {
				if (vis) {
					this.comDetails = 'comDetails'
					this.page = 'pages'
				} else {
					this.comDetails = ''
					this.page = ''
				}
			},
			opensetting(e) {

			},
			view(img) {
				// 预览图片
				uni.previewImage({
					urls: ['https://xcx.huitengzx.com/storage/file/' + img],
				});
			},
			getComment() {
				var that = this
				uni.request({
					url: app.globalData.url + 'comment/entry',
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
			//去评论
			toComment(pid, toUid, toName) {
				app.checkLogin2()
				this.toUid = toUid
				this.toName = toName
				this.toPid = pid
				this.focus = true
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
					url: app.globalData.url + 'comment/add',
					method: 'post',
					data: {
						content: that.toContent,
						pid: that.toPid,
						to_uid: that.toUid,
						aid: that.id,
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
							that.getInfo()
							that.toContent = ''
						}
					}
				})
			},
			btnCom() {
				this.getComment()
			},
			blur() {
				this.toName = ''
				this.focus = false
			},
			getActivity(){
				uni.request({
					data:{aid:that.aid},
					url:app.globalData.url+'activity',
					success(res) {
						that.activity = res.data.data
						that.back_time = res.data.data.closes
						that.is_new = res.data.data.is_new
						setTimeout(function(){
							that.show_act = true
							that.t = setInterval(function(){
								that.back_time--
								if(that.back_time <= 0){
									that.back_to = 1
									clearInterval(that.t)
								}
							},1000)
						},res.data.data.show)
					}
				})
			},
			act_close(){
				if(that.back_to){
					that.show_act = false
				}
			},
			getInfo: function() {
				uni.showLoading({
					title: '加载中'
				});
				var that = this
				uni.request({
					url: app.globalData.url + 'trend/detail',
					data: {
						id: that.id,
						api_token: app.globalData.api_token
					},
					success: function(res) {
						that.info = res.data.data
						that.getWallet()
						for(let i in that.info.file1){
							that.path.push({path:''})
						}
					},
					complete: function() {
						uni.hideLoading()
						uni.stopPullDownRefresh();
					}
				})
			},
			downLoad(file, type,k) {
				var that = this
				if (type == 'image') {
					uni.authorize({
						scope: 'scope.writePhotosAlbum',
						success() {
							uni.downloadFile({
								url: 'https://xcx.huitengzx.com/storage/file/' + file, //仅为示例，并非真实的资源
								success: (res) => {
									if (res.statusCode === 200) {
										uni.saveImageToPhotosAlbum({
											filePath: res.tempFilePath,
											success: function() {
												console.log('save success');
											}
										});
									}
								}
							});
						},
						fail() {
							uni.showToast({
								title: '再次点击下载打开授权相册功能',
								icon: 'none',
								success() {
									that.writePic = ''
								}
							})

						}
					})
					return;
				}
				uni.downloadFile({
					url: 'https://xcx.huitengzx.com/storage/file/' + file, //仅为示例，并非真实的资源
					success: (res) => {
						if (res.statusCode === 200) {
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success: function(res) {
									var savedFilePath = res.savedFilePath
									uni.showToast({
										title: '下载成功',
										icon: 'none'
									})
									that.path[k].path = savedFilePath
								}
							});
						}
					}
				});
			},
			getWallet(){
				that.$u.get('wallet', {api_token:app.globalData.api_token}).then(res => {
					that.voucher = res.data.voucher
					that.payInfo[1].voucher = res.data.voucher
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
							if(that.invite_id){
								that.activity_user_help_save()
							}
						}
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
							data:{api_token:app.globalData.api_token,is_new:e.data,invite_id:that.invite_id,id:that.id,aid:that.aid},
							success(res) {
								
							}
						})
					}
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
			activity_user_save(){
				uni.request({
					url:app.globalData.url+'activity/user_save',
					method:'POST',
					data:{api_token:app.globalData.api_token,id:that.id,aid:that.aid},
					success(res) {
						
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
		//下拉刷新
		onPullDownRefresh() {
			this.page = 1
			this.getInfo()
			this.cpage = 1
			this.getComment()
		},
		onReachBottom() {
			if (!this.comDetails) {
				this.getInfo()
			}
		},
		onShareAppMessage(res){
			var title = that.info.title
			var path = '/pages/trend/detail?id='+that.id
			if (res.from === 'button') { // 来自页面内转发按钮
				title = '分享有礼红包领不停'
				path = '/pages/trend/detail?id=' + that.id + '&invite_id=' + that.user.id + '&aid=' + that.activity.id
				
			}
			return {
				title: title,
				path: path,
				imageUrl:that.info.file[0].type == 'image'?'https://xcx.huitengzx.com/storage/file/'+that.info.file[0].file:'' 
			}
		},
		onUnload() {
			clearInterval(that.t)
		},
		onShow() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			uni.setStorage({
				key: 'url',
				data: '/' + page.route + '?id=' + that.id+ '&invite_id=' + that.invite_id + '&aid=' + that.aid,
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin()
						that.api_token = app.globalData.api_token
						if(that.api_token){
							that.getUser()
							that.getActivity()
							that.getConfig()
							that.getInfo()
							that.getComment()
						}
					})
				}
			})
			uni.getSetting({
				success(res) {
					if (res.authSetting['scope.writePhotosAlbum']) {
						that.writePic = 1
					}
				}
			})
		},
		onShareTimeline(res) {
			return {
				title: that.info.title,
				query: 'id='+that.id,
				imageUrl:that.info.file[0].type == 'image'?'https://xcx.huitengzx.com/storage/file/'+that.info.file[0].file:''
			}
		},
		onLoad: function(e) {
			that = this
			that.id = e.id
			that.aid = e.aid?e.aid:''
			that.invite_id = e.invite_id?e.invite_id:''
			
			
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
		
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import url('@/static/css/articleArticle.css')
</style>
