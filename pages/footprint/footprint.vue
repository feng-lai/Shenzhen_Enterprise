<template>
	<view class="container999" @touchstart="refreshStart" @touchmove="refreshMove" @touchend="refreshEnd">
		<view class='nav'>
			<navTab ref="navTab" :tabTitle="tabTitle" @changeTab='changeTab'></navTab>
		</view>
		<view class="company" v-if="!currentTab && company.length">
			<block v-for="(v,k) in company">
				<view class="row">
					<view class="date">
						{{v.date}}
					</view>
					<view class="content">
						<block v-for="(val,key) in v.entry">
							<navigator class="list" hover-class="none" :url="'/pages/company/company?id='+val.cid">
								<view class="left img">
									<image src="https://xcx.huitengzx.com/images/companys.png"></image>
								</view>
								<view class="left text">{{val.name}}</view>
								<view class="clear"></view>
							</navigator>
						</block>
					</view>
				</view>
			</block>
			<view style="width: 100%;"><uni-load-more :status="more" :contentText="contentText"></uni-load-more></view>
		</view>
		<view class="company" v-if="!currentTab && !company.length">
			<view class="empty">当前还没有足迹</view>
		</view>
		<view class="company" v-if="currentTab && article.length">
			<block v-for="(v,k) in article">
				<view class="row">
					<view class="date">
						{{v.date}}
					</view>
					<view class="content">
						<block v-for="(val,key) in v.entry">
							<navigator class="list" hover-class="none" :url="'/pages/trend/detail?id='+val.aid">
								<view class="left img">
									<image :src="val.profile_pic"></image>
								</view>
								<view class="left text">{{val.name}}</view>
								<view class="clear"></view>
							</navigator>
						</block>
					</view>
				</view>
			</block>
			<view style="width: 100%;"><uni-load-more :status="mores" :contentText="contentTexts"></uni-load-more></view>
		</view>
		<view class="intention" v-if="currentTab && !article.length">
			<view class="empty">当前还没有足迹</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	const util = require('../../util/util.js');
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import navTab from '../../components/navTab.vue';
	export default {
		components: {
			navTab
		},
		data() {
			return {
				tabTitle: ['浏览过的公司', '浏览过的意向'], //导航栏格式 --导航栏组件
				currentTab: 0, 
				type:0 ,//0公司 1意向
				page1:1,
				page2:1,
				num:10,
				company:[],
				article:[],
				more: 'loading',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				mores: 'loading',
				contentTexts: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
			}
		},
		components: {
			uniLoadMore
		},
		onShareAppMessage(){
			
		},
		methods: {
			// 刷新touch监听
			refreshStart(e) {
				if(this.currentTab){
					this.type = 0
				}else{
					this.type = 1
				}
			},
			refreshMove(e) {
				//console.log(this.currentTab)
			},
			refreshEnd(e) {
				//console.log(this.currentTab)
			},
			getCompany(){
				var that = this
				uni.request({
					url:app.globalData.url+'footprint/company',
					data:{page:that.page1,num:that.num,api_token:app.globalData.api_token},
					success(res) {
						let page = that.page1;
						var content = that.company; //页码为1时
						if (page == 1) {
							content = [];
						}
						var company = res.data.data; //后台请求拿到的结果
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.company = content.concat(company)
						if (page <= res.data.lastPage) {
							that.page++
						}else{
							that.more = 'noMore'
						}
						if(company.length<that.num){
							that.more = 'noMore'
						}
					}
				})
			},
			getArticle(){
				var that = this
				uni.request({
					url:app.globalData.url+'footprint/article',
					data:{page:that.page2,num:that.num,api_token:app.globalData.api_token},
					success(res) {
						let page = that.page2;
						var content = that.article; //页码为1时
						if (page == 1) {
							content = [];
						}
						var article = res.data.data; //后台请求拿到的结果
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.article = content.concat(article)
						if (page <= res.data.lastPage) {
							that.page++
						}else{
							that.mores = 'noMore'
						}
						if(!article.length<that.num){
							that.mores = 'noMore'
						}
					}
				})
			}
		},
		onReachBottom() {
			if(this.type){
				this.getArticle()
			}else{
				this.getCompany()
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
						that.getCompany()
						that.getArticle()
					})
				}
			})
		}
	}
</script>

<style>
	@import url('@/static/css/footprint.css')
</style>
