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
					<view class="text status" v-if="user.auths == 1">
						<image src="../../static/image/l3.png"
							style="width: 45rpx; height: 45rpx; margin-right: 10rpx;"></image><text>(认证用户)</text>
					</view>
				</view>
			</view>
			<navigator class="right" @click="dingyue()">
				<uni-icons type="chat" size="30"></uni-icons>
				<text style="position: absolute; top: 25rpx; right: -10rpx; color: #FFFFFF; background-color: red; border-radius: 100%; padding: 0 10rpx; height: 30rpx; line-height: 30rpx; font-size: 26rpx;" v-if="chat_num">{{chat_num}}</text>
			</navigator>
			<view class="clear"></view>
		</view>
		<view class="list">
			<navigator class="row" :url="'/pages/mine/card?id='+user.cid" hover-class="none">我的名片</navigator>
			<navigator class="row" hover-class="none" url="/pages/mine/trend">我的意向</navigator>
			<navigator class="row" hover-class="none" url="/pages/footprint/footprint">我的足迹</navigator>
			<navigator class="row" hover-class="none" url="/pages/mine/auth">我的认证</navigator>
		</view>
		<view class="com">
			<view class="entry">
				<block v-for="(v,k) in info">
					<view class="row" style="display: flex; align-items: center;">
						<navigator class="left"  hover-class="none" :url="'/pages/msg/code?id='+v.id" v-if="v.type != 4">
							<view class="title">{{v.content}}</view>
							<view class="desc">状态 : {{v.status}}<block v-if="v.status == '审核失败'">(原因:{{v.reason}})</block></view>
							<view class="desc">时间 : {{v.updated_at}}</view>
						</navigator>
						<view class="left" v-else>
							<view class="title">{{v.content}}</view>
							<view class="desc">状态 : {{v.status}}<block v-if="v.status == '审核失败'">(原因:{{v.reason}})</block></view>
							<view class="desc">时间 : {{v.updated_at}}</view>
						</view>
						<view class="clear"></view>
					</view>
				</block>
				<view style="width: 100%;">
					<uni-load-more :status="more" :contentText="contentText"></uni-load-more>
				</view>
			</view>
		</view>
		<navigator class="add_msg" url="/pages/msg/code_add2"><text class="other_btn">编辑短信</text></navigator>
		<e-modal :visible.sync="visibles" @cancel="handleCancels">
			<view class="model">
				<view class="group">
					<textarea v-model="content" style="border:1rpx solid #666; width: initial; border-radius: 10rpx; margin-top: 10rpx; padding: 10rpx; line-height: initial;"></textarea>
				</view>
				<view class="submit">
					<button class="other_btn" @click="submit()">确认</button>
				</view>
			</view>
		</e-modal>
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
					contentnomore: "没有更多数据了"
				},
				phone: '',
				tid: '',
				word: '',
				chat_num:0,
				visibles:false,
				content:'',
				id:''
			}
		},
		components: {
			uniLoadMore
		},
		onLoad() {
			that = this
		},
		onShareAppMessage() {

		},
		methods: {
			submit(){
				if(!that.content){
					uni.showToast({
						title:'内容不能为空',
						icon:'none'
					})
					return;
				}
				uni.request({
					url:app.globalData.url+'msg/code/edit',
					method:"POST",
					data:{api_token:app.globalData.api_token,id:that.id,content:that.content},
					success(res) {
						that.page = 1
						that.getInfo()
						that.visibles = false
					}
				})
			},
			edit(content,id){
				that.visibles = true
				that.content = content
				that.id = id
			},
			getNoticeNum(){
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
			getUser() {
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
			},
			getInfo(){
				uni.request({
					url: app.globalData.url + 'msg/code/entry',
					data: {
						api_token: app.globalData.api_token,
						page:that.page,
						num:that.num
					},
					success(res) {
						if (res.data.result == 1) {
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
						that.getUser()
						that.getNoticeNum()
						that.getInfo()
					})
				}
			})
		},
		onReachBottom() {
			
		}
	}
</script>

<style>
	@import url('@/static/css/mine.css')
</style>
