<template>
	<view>
		<view class="top">
			<navigator hover-class="none" url="/pages/search/search">
				<input type="" name="word" disabled="true" :placeholder="word" />
			</navigator>
		</view>
		
		<!--  #ifdef  H5 -->
		<swiper class="swiper" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration">
			<block v-for="(v,k) in banner" v-if="v.type == 1">
				<swiper-item>
					<view @click="link_to(v.url)" class="swiper-item uni-bg-red">
						<image :src="v.img"/> 
					</view> 
				</swiper-item>
			</block> 
		</swiper>
		<!--  #endif -->
		<!--  #ifndef  H5 -->
		<swiper class="swiper" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration">
			<block v-for="(v,k) in banner" v-if="v.type == 1">
				<swiper-item>
					<navigator class="swiper-item uni-bg-red" hover-class="none"
						:url="'/pages/banner/banner?url='+v.url">
						<image :src="v.img"/> 
					</navigator>
				</swiper-item>
			</block>
		</swiper>
		<view class="provide">
			<view class="left" style="color: #EA1111;">我需要</view>
			<view class="left">
				<text @click="to(1,1)" style="background-color: #F36D0D;">产品</text>
				<text @click="to(1,2)" style="background-color: #F36D0D;">设备</text>
				<text @click="to(1,3)" style="background-color: #F36D0D;">技术</text>
				<text @click="to(1,4)" style="background-color: #F36D0D;">人工</text>
			</view> 
			<view class="right">
				<text @click="to(1,5)" style="color: #EA1111;">更多</text>
				<uni-icons class="icon" type="arrowright" size="16"></uni-icons>
			</view>
			<view class="clear"></view>
		</view>
		<view class="provide">
			<view class="left" style="color: #1F8E1C;">我提供</view>
			<view class="left">
				<text @click="to(2,1)" style="background-color: #2BAF87;">产品</text>
				<text @click="to(2,2)" style="background-color: #2BAF87;">设备</text>
				<text @click="to(2,3)" style="background-color: #2BAF87;">技术</text>
				<text @click="to(2,4)" style="background-color: #2BAF87;">人工</text>
			</view>
			<view class="right">
				<text @click="to(2,5)" style="color: #1F8E1C;">更多</text>
				<uni-icons class="icon" type="arrowright" size="16"></uni-icons>
			</view>
			<view class="clear"></view>
		</view>
		<!--  #endif -->
		<view :class="option_fixed" :style="'top:'+top+'px'">
			<view class="option" id="option">
				<view class="row"><text :class="type == 1?'active':''" @click="change(1)">需求动态</text></view>
				<view class="row"><text :class="type == 2?'active':''" @click="change(2)">平台文章</text></view>
				<view class="row" v-if="is_video == 1"><text :class="type == 3?'active':''"
						@click="change(3)">平台视频</text></view>
			</view>
		</view>
		<view class="entry" v-if="type == 1">
			<view class="title">平台动态</view>
			<block v-for="(v,k) in info">
				<ad unit-id="adunit-184701a939853ff7" v-if="k%4 == 0 && k != 0"></ad>
				<navigator class="row" hover-class="none" :url="'/pages/trend/detail?id='+v.id">
					<view class="user">
						<image :src="v.profile_pic">
							<view class="left">
								<view class="text">{{v.name}}</view>
								<view class="text">{{v.created_at}}</view>
							</view>
							<view class="right" v-if="v.type == 1">
								找供应
							</view>
							<view class="right" v-if="v.type == 2">
								找需求
							</view>
							<view class="clear"></view>
					</view>
					<view class="content">
						<view class="left img">
							<image :src="v.img" mode="aspectFit">
						</view>
						<view class="left">
							<view class="title">{{v.title}}</view>
							<rich-text :nodes="v.content" class="desc"></rich-text>
						</view>
						<view class="clear"></view>
					</view>
				</navigator>
			</block>
			<view style="width: 100%;">
				<uni-load-more :status="more" :contentText="contentText"></uni-load-more>
			</view>
		</view>
		<view class="entry" v-if="type == 2">
			<view class="title">平台文章</view>
			<block v-for="(v,k) in info">
				<ad unit-id="adunit-184701a939853ff7" v-if="k%4 == 0 && k != 0"></ad>
				<navigator class="row" hover-class="none" :url="'/pages/article/detail?id='+v.id+'&api_token='+api_token">
					<view class="user">
						<image :src="v.profile_pic">
							<view class="left">
								<view class="text">{{v.name}}</view>
								<view class="text">{{v.created_at}}</view>
							</view>
							<view class="clear"></view>
					</view>
					<view class="content">
						<view class="left img">
							<image :src="v.img" mode="aspectFit">
						</view>
						<view class="left">
							<view class="title">{{v.title}}</view>
							<rich-text :nodes="v.content" class="desc"></rich-text>
						</view>
						<view class="clear"></view>
					</view>
				</navigator>
			</block>
			<view style="width: 100%;">
				<uni-load-more :status="more" :contentText="contentText"></uni-load-more>
			</view>
		</view>
		<view class="entry" v-if="type == 3">
			<view class="title">平台视频</view>
			<block v-for="(v,k) in info">
				<ad unit-id="adunit-184701a939853ff7" v-if="k%4 == 0 && k != 0"></ad>
				<view class="row" style="position: relative;">
					<view class="title"
						style="position: absolute; left: 0; top: 20rpx;z-index: 2; color: #FFFFFF; width: 710rpx; padding: 0 20rpx; text-align: center;">
						{{v.title}}</view>
					<video :id="'video_'+v.id" :src="v.url" :poster="v.img" :title="v.title"
						@play="plays(v.id)"></video>
					<view class="user">
						<image :src="v.profile_pic">
							<view class="left">
								<view class="text">{{v.name}}</view>
								<view class="text">{{v.time}}</view>
							</view>
							<button class="right" open-type="share" :data-img="v.img" :data-content="v.title"
								:data-id="v.id">
								<uni-icons type="weixin" size="26" color="#47c04c"></uni-icons>
							</button>
							<navigator class="right" hover-class="none" :url="'/pages/video/video?id='+v.id">
								<uni-icons type="chatbubble" size="25" color="#484848"></uni-icons>
							</navigator>
							<view class="clear"></view>
					</view>
				</view>
			</block>
			<view style="width: 100%;">
				<uni-load-more :status="more" :contentText="contentText"></uni-load-more>
			</view>
		</view>
		<!--  #ifdef  MP-WEIXIN -->
		<!--<button class="getPhone" open-type="getPhoneNumber" @getphonenumber="getphonenumbers" v-if="getPhone"></button>-->
		<!--  #endif -->
		<view class="nav">
			<view class="nav_row">
				<view class="left active">
					<view class="img">
						<image src="../../static/image/indexs.png"></image>
					</view>
					<view class="name">
						首页
					</view>
				</view>
				<navigator class="left" hover-class="none" url="/pages/project/entry" open-type="redirect">
					<view class="img">
						<image src="../../static/image/trend.png"></image>
					</view>
					<view class="name">
						招募动态
					</view>
				</navigator>
				<!--  #ifndef  H5 -->
				<navigator class="left" hover-class="none" url="/pages/project/project" open-type="redirect">
					<view class="img">
						<image src="../../static/image/issue.png"></image>
					</view>
					<view class="name">
						招募合作
					</view>
				</navigator>
				<!--  #endif -->
				
				<!--  #ifndef  H5 -->
				<navigator class="left" hover-class="none" url="/pages/contact/contact" open-type="redirect">
					<view class="img">
						<image src="../../static/image/contact.png"></image>
					</view>
					<view class="name">
						联系我们
					</view>
				</navigator>
				<!--  #endif -->
				<!--  #ifdef  H5 -->
				<view class="left" @click="link_to('https://xcx.huitengzx.com/contact_us?web=1')">
					<view class="img">
						<image src="../../static/image/contact.png"></image>
					</view>
					<view class="name">
						联系我们
					</view>
				</view>
				<!--  #endif -->
				
				
				
				<!--  #ifndef  H5 -->
				<navigator class="left" hover-class="none" url="/pages/mine/mine" open-type="redirect">
					<view class="img">
						<image src="../../static/image/mine.png"></image>
					</view>
					<view class="name">
						我的
					</view>
				</navigator>
				<!--  #endif -->
			</view>
			<!--  #ifdef  H5 -->
			<view style="text-align: center; background-color: #FFFFFF;height: 100rpx;line-height: 100rpx;">粤ICP备20055018号-2 </view>
			<!--  #endif -->
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				page: 1,
				num: 10,
				info: [],
				cate: [],
				more: 'loading',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				banner: '',
				getPhone: '',
				word: '',
				type: 1,
				top: '',
				option_fixed: '',
				o_top: '',
				article: '',
				video: '',
				is_video: '',
				api_token:''
			}
		},
		components: {
			uniLoadMore
		},
		onReachBottom() {

		},
		onShareAppMessage(res) {
			
		},
		onPageScroll(e) {
			var that = this
			// #ifdef  MP-WEIXIN
			if (e.scrollTop > that.o_top) {
				that.option_fixed = 'option_fixed'
			} else {
				that.option_fixed = ''
			}
			// #endif
		},
		methods: {
			link_to(url){
				location.href=url
			},
			change(type) {
				var that = this
				that.type = type
				that.page = 1
				switch (parseInt(type)) {
					case 1:
						that.getInfo()
						break;
					case 2:
						that.getArticle()
						break;
					case 3:
						that.getVideo()
						break;
				}
			},
			//视频播放次数增id加
			plays(id) {
				uni.request({
					url: app.globalData.url + 'video/plays',
					method: 'POST',
					data: {
						id: id
					},
				})
				for (let i in this.info) {
					if (this.info[i].id != id) {
						uni.createVideoContext('video_' + this.info[i].id).stop();
					}
				}

			},
			getInfo() {
				var that = this
				uni.request({
					url: app.globalData.url + 'trend/entry',
					data: {
						num: that.num,
						page: that.page
					},
					success(res) {
						let page = that.page;
						var content = that.info; //页码为1时
						if (page == 1) {
							content = [];
						}
						var info = res.data.data; //后台请求拿到的结果
						that.is_video = res.data.is_video
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.info = content.concat(info)
						if (page <= res.data.lastPage) {
							that.page++
						} else {
							that.more = 'noMore'
						}
						if (that.info.length < that.num) {
							that.more = 'noMore'
						}
					}
				})
			},
			getArticle() {
				var that = this
				uni.request({
					url: app.globalData.url + 'article/entry',
					data: {
						num: that.num,
						page: that.page
					},
					success(res) {
						let page = that.page;
						var content = that.info; //页码为1时
						if (page == 1) {
							content = [];
						}
						var info = res.data.data; //后台请求拿到的结果
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.info = content.concat(info)
						if (page <= res.data.lastPage) {
							that.page++
						} else {
							that.more = 'noMore'
						}
						if (that.info.length < that.num) {
							that.more = 'noMore'
						}
					}
				})
			},
			getVideo() {
				var that = this
				uni.request({
					url: app.globalData.url + 'video/entry',
					data: {
						num: that.num,
						page: that.page
					},
					success(res) {
						let page = that.page;
						var content = that.info; //页码为1时
						if (page == 1) {
							content = [];
						}
						var info = res.data.data; //后台请求拿到的结果
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.info = content.concat(info)
						if (page <= res.data.lastPage) {
							that.page++
						} else {
							that.more = 'noMore'
						}
						if (that.info.length < that.num) {
							that.more = 'noMore'
						}
					}
				})
			},
			getBanner() {
				var that = this
				uni.request({
					url: app.globalData.url + 'banner',
					success(res) {
						that.banner = res.data.data
					}
				})
			},
			to(type, cid) {
				uni.setStorage({
					key: 'to',
					data: type + ',' + cid,
					success() {
						uni.redirectTo({
							url: '/pages/issue/issue'
						})
					}
				})
			},
			/**getphonenumbers(e) {
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
											code: loginRes.code,
											encryptedData: e.detail.encryptedData,
											iv: e.detail.iv,
											api_token: app.globalData.api_token
										},
										method: 'post',
										success(res) {
											if (res.data.result == 1) {
												uni.setStorage({
													key: 'phone',
													data: res.data.data,
													success() {
														//that.getPhone = ''
														uni.redirectTo({
															url: '/pages/login/login'
														})
													}
												})
											} else {
												uni.showToast({
													title: '系统繁忙，请稍后重试',
													icon: 'none'
												})
											}
											uni.showToast({
												title: res.data.msg,
												icon: 'none'
											})
										}
									})
								}
							});
						}
					}
				});
			},**/
			getSearch() {
				var that = this
				uni.request({
					url: app.globalData.url + 'search/default',
					success(res) {
						that.word = res.data.data
						uni.setStorage({
							key: 'searchDefault',
							data: res.data.data
						})
					}
				})
			},
		},
		onLoad() {
			var that = this
			uni.setStorage({
				key: 'url',
				data: '/pages/index/index',
				success: function() {
					app.isLogin().then(function() {
						wx.getStorage({
							key: 'phone',
							fail() {
								if (!app.globalData.api_token) {
									that.getPhone = 1
								}
							}
						})
						that.getInfo()
						that.api_token = app.globalData.api_token
					})
				}
			})
		},
		onShow() {
			var that = this
			
			const query = uni.createSelectorQuery().in(this);
			query.select('.top').boundingClientRect(data => {
				that.top = data.height
			}).exec();
			query.select('#option').boundingClientRect(data => {
				that.o_top = data.top
			}).exec();
		
			that.getBanner()
			that.getSearch()
			// #ifdef  MP-WEIXIN
			const updateManager = uni.getUpdateManager();
			updateManager.onUpdateReady(function() {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',

					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}

				});
			});
			// #endif
		},
		onReachBottom() {
			var that = this
			switch (parseInt(this.type)) {
				case 1:
					that.getInfo()
					break;
				case 2:
					that.getArticle()
					break;
				case 3:
					that.getVideo()
					break;
			}
		},
	}
</script>

<style>
	@import url('@/static/css/index.css')
</style>
