<template>
	<view>
		<view class="top">
			<view class="option">
				<view class="row"><text :class="type == 1?'active':''" @click="change(1)">公司</text></view>
				<view class="row"><text :class="type == 2?'active':''" @click="change(2)">需求动态</text></view>
				<view class="row"><text :class="type == 3?'active':''" @click="change(3)">平台文章</text></view>
				<view class="row"><text :class="type == 4?'active':''" @click="change(4)">平台视频</text></view>
			</view>
		</view>
		<view class="entry" v-if="type == 1">
			<view class="title">相关公司</view>
			<block v-for="(v,k) in info" v-if="info.length">
				<navigator class="row" hover-class="none" :url="'/pages/company/company?id='+v.id">
					<view class="content">
						<view class="left img">
							<image :src="v.img" mode="aspectFit">
						</view>
						<view class="left">
							<view class="title">{{v.name}}</view>
							<view class="desc">tag词:{{v.tag}}</view>
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
			<view class="title">相关动态</view>
			<block v-for="(v,k) in info" v-if="info.length">
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
							<view class="desc">{{v.content}}</view>
						</view>
						<view class="clear"></view>
					</view>
				</navigator>
			</block>
			<view style="width: 100%;">
				<uni-load-more :status="more" :contentText="contentText"></uni-load-more>
			</view>
		</view>
		<view class="entry"  v-if="type == 3">
			<view class="title">相关文章</view>
			<block v-for="(v,k) in info" v-if="info.length">
				<navigator class="row" hover-class="none" :url="'/pages/article/detail?id='+v.id">
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
							<view class="desc">{{v.content}}</view>
						</view>
						<view class="clear"></view>
					</view>
				</navigator>
			</block>
			<view style="width: 100%;">
				<uni-load-more :status="more" :contentText="contentText"></uni-load-more>
			</view>
		</view>
		<view class="entry"  v-if="type == 4">
			<view class="title">相关视频</view>
			<block v-for="(v,k) in info" v-if="info.length">
				<view class="row">
					<video id="myVideo" :src="v.url" controls :poster="v.img" :title="v.content" @play="plays(v.id)"></video>
					<view class="user">
						<image :src="v.profile_pic">
							<view class="left">
								<view class="text">{{v.name}}</view>
								<view class="text">{{v.time}}</view>
							</view>
							<view class="clear"></view>
					</view>
					
				</view>
			</block>
			<view style="width: 100%;">
				<uni-load-more :status="more" :contentText="contentText"></uni-load-more>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	var that
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				tag:'',
				type:1,
				page: 1,
				num: 10,
				info: [],
				more: 'loading',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
			}
		},
		components: {
			uniLoadMore
		},
		onLoad(e) {
			that = this
			that.tag = e.tag
			uni.setNavigationBarTitle({
				title: 'tag词 : '+e.tag
			})
			app.isLogin().then(function() {
				that.getCompany()
			})
		},
		onShow() {
			
		},
		methods: {
			change(type){
				that.type = type
				that.page = 1
				switch(parseInt(type)){
					case 1:
						that.getCompany()
					break;
					case 2:
						that.getInfo()	
					break;
					case 3:
						that.getArticle()
					break;
					case 4:
						that.getVideo()
					break;
				}
			},
			//视频播放次数增id加
			plays(id){
				uni.request({
					url:app.globalData.url+'video/plays',
					method:'POST',
					data:{id:id},
				})
			},
			getInfo() {
				uni.request({
					url: app.globalData.url + 'trend/entry',
					data: {
						num: that.num,
						page: that.page,
						tag: that.tag
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
			getArticle(){
				uni.request({
					url: app.globalData.url + 'article/entry',
					data: {
						num: that.num,
						page: that.page,
						tag: that.tag
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
			getVideo(){
				uni.request({
					url: app.globalData.url + 'video/entry',
					data: {
						num: that.num,
						page: that.page,
						tag: that.tag
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
			getCompany(){
				uni.request({
					url: app.globalData.url + 'search/company',
					data: {
						num: that.num,
						page: that.page,
						tag: that.tag,
						api_token:app.globalData.api_token
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
		},
		onReachBottom() {
			switch(parseInt(this.type)){
				case 1:
					that.getCompany()
				break;
				case 2:
					that.getInfo()	
				break;
				case 3:
					that.getArticle()
				break;
				case 4:
					that.getVideo()
				break;
			}
		},
	}
</script>

<style>
@import url('@/static/css/tag.css')
</style>
