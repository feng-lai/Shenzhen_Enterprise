<template>
	<view>
		<view class="form">
			<view class="group">
				<view class="title">{{info.title}}</view>
				<rich-text class="desc" :nodes="info.content"></rich-text>
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
				<view class="left text" v-if="info.tag">
					tag : 
					<block v-for="(v,k) in info.tag.split(',')">
						<text style="display: inline-block; height:50rpx;line-height: 50rpx; padding: 0 10rpx; border-radius: 10rpx; border: 1rpx solid #f5f5f5; margin-left: 10rpx; margin-bottom: 10rpx;">{{v}}</text>
					</block>
				</view>
				<view class="clear" v-if="info.tag"></view>
			</view>
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
						<button size="mini" @click="downLoad(v.file,v.type,k)" v-if="writePic">下载</button>
						<button size="mini" open-type="openSetting" @opensetting="opensetting" v-else>下载</button>
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
								<rich-text :nodes="v.content" class="desc"></rich-text>
								<view class="time">
									<view class="left">{{v.time}}</view>
									<view class="right">
										<uni-icons type="chat" size="18" color="#000000" @click="toComment(v.id,v.uid,v.name)"></uni-icons>
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
													<text>{{val.to_name}}</text>
												</view>
												<view class="desc">{{val.content}}</view>
												<view class="time">
													<view class="left">{{val.time}}</view>
													<view class="right">
														<image src="../../static/image/com.png" @click="toComment(val.pid,val.uid,val.name)" />
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
			</scroll-view>
			<view class="input">
				<view class="title" v-if="toName">评论给{{toName}}{{info.uid == toUid?'(作者)':''}}</view>
				<view class="row">
					<textarea @input="textarea" :value="toContent" class="left" :focus="focus" @blur="blur" @click="toComment(0,info.uid,info.name)"></textarea>
					<view class="right" @click="commentSubmit()"><button size="mini">发布</button></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
			}
		},
		methods: {
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
			getInfo: function() {
				uni.showLoading({
					title: '加载中'
				});
				var that = this
				uni.request({
					url: app.globalData.url + 'article/detail',
					data: {
						id: that.id,
						api_token: app.globalData.api_token
					},
					success: function(res) {
						that.info = res.data.data
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
				/* uni.setClipboardData({
					data: 'https://xcx.huitengzx.com/download?name=' + this.info.file,
					success: function() {
						uni.showToast({
							title: '文件下载链接已复制,请粘贴到浏览器进行下载',
							icon: 'none'
						})
					}
				}); */
			}
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
		onShareAppMessage(){
			
		},
		onShow() {
			var that = this
			app.isLogin().then(function() {
				that.getInfo()
				that.getComment()
			})
			uni.getSetting({
				success(res) {
					if (res.authSetting['scope.writePhotosAlbum']) {
						that.writePic = 1
					}
				}
			})
			console.log(123)
		},
		onLoad: function(e) {
			this.id = e.id
			var that = this
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			uni.setStorage({
				key: 'url',
				data: '/' + page.route + '?id=' + page.id,
			})
		},
	}
</script>

<style>
	@import url('@/static/css/articleArticle.css')
</style>
