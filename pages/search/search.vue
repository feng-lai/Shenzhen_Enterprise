<template>
	<view>
		<!--pages/search/index.wxml-->
		<view class="tops">
			<input name="word" placeholder="搜索关键词" @confirm="comResult" @input="getWordFun" @focus="getFocus" :focus="inputShowed"
			 :value="word" />
		</view>
		<view class="pageOne" v-if="display == 1">
			<view class="history" v-if="history && history.length != 0">
				<view class="top">
					历史搜索
					<view class="right">
						<uni-icons type="trash" color="#979797" :size="16" @tap="clearHistory"></uni-icons>
					</view>
				</view>
				<view class="info">
					<block v-for="(v, k) in history" :key="k">
						<view class="left" @tap="getResult" :data-word="v">{{v}}</view>
					</block>
					<view class="clear"></view>
				</view>
			</view>
			<view class="history" v-if="hot">
				<view class="top">
					热门搜索
				</view>
				<view class="info">
					<block v-for="(v, k) in hot" :key="k">
						<view class="left" @tap="getResult" :data-word="v.word">{{v.word}}</view>
					</block>
					<view class="clear"></view>
				</view>
			</view>
		</view>
		<view class="pageTwo" v-if="display == 2">
			<block v-for="(v, k) in getWord" :key="k">
				<view class="row" @tap="getResult" :data-word="v.word">{{v.word}}</view>
			</block>
		</view>
		<view class="pageThree" v-if="display == 3 || display == 4">
			<view class="atricle product" v-if="display == 3">
				<view class="entry" v-if="info.length">
					<block v-for="(v,k) in info">
						<navigator class="row" hover-class="none" :url="'/pages/trend/detail?id='+v.id">
							<view class="content">
								<view class="left img">
									<image :src="v.img">
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
				<view class="empty" v-else>
					暂时没有您要的结果，发个意向试试，也许会有人联系你
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/search/index.js
	const app = getApp()
	export default {
		data() {
			return {
				//图片链接
				imgUrl: app.globalData.imgUrl,
				//搜索关键词
				word: '',
				//更多关键词
				moreWord: '',
				inputShowed: true,
				//1:历史 2:有关词展示 3:结果
				display: 1,
				page: 1,
				num: 20,
				info: [],
				hot: '',
				history: '',
				getWord: "",
				type:1,
				more: 'loading',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			var that = this;
			uni.getStorage({
				key: 'history',
				success: function(res) {
					that.history = res.data
				}
			});
			uni.showLoading({
				title: '加载中'
			});
		},
		onShareAppMessage(){
			
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			var that = this
			that.getHot();
			uni.getStorage({
				key:'searchDefault',
				success(res){
					that.word = res.data
				}
			})
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			if (this.display == 3 || this.display == 4) {
				if (this.word) {
					this.getInfo()
				}
			}
		},
		methods: {
			//切换选项
			searchType(e){
				uni.showLoading()
				this.more = 'loading'
				this.type = e.currentTarget.dataset.type
				this.page = 1
				if(this.type == 1){
					this.display = 3
				}else{
					this.display = 4
				}
				this.getInfo()
			},
			/**热门词*/
			getHot: function() {
				var that = this;
				uni.request({
					url: app.globalData.url + 'search/hot',
					success: function(res) {
						if (res.data.result == 1) {
							that.hot = res.data.data,
								that.shop = res.data.shop
						}
					},
					complete: function() {
						uni.hideLoading();
					}
				});
			},

			/**
			 * 
			 * 监听关键词输入
			 */
			getWordFun: function(e) {
				let word = e.detail.value
				this.word = word
				if (word) {
					this.display = 2
				} else {
					this.display = 1
				}
				this.getwordInfo()
			},

			/***
			 * 获取焦点
			 * 
			 */
			getFocus: function(e) {
				let word = e.detail.value
				if (word) {
					this.display = 2
				}

				this.getwordInfo()
			},

			/**
			 * 获取关键词信息
			 */
			getwordInfo: function(word) {
				var that = this;
				uni.request({
					url: app.globalData.url + 'search/word',
					data: {
						word:that.word
					},
					success: function(res) {
						if (res.data.result == 1) {
							that.getWord = res.data.data
						}
					}
				});
			},

			/**
			 * 获取结果
			 */
			getResult: function(e) {
				uni.showLoading({
					title: '加载中'
				});
				let word = e.currentTarget.dataset.word;
				this.word = word,
					this.page = 1
				if (word) {
					this.getInfo();
				}
			},
			getInfo: function() {
				var that = this;
				let word = that.word;
				uni.getStorage({
					key: 'history',
					success: function(res) {
						let data = res.data;
						if (data.indexOf(that.word) == -1) {
							if (that.word) {
								res.data.push(that.word);
							}
							that.history = res.data
							uni.setStorage({
								key: 'history',
								data: res.data
							});
						}
					},
					fail: function(res) {
						let arr = [];

						if (that.word) {
							arr.push(that.word);
						}

						uni.setStorage({
							key: 'history',
							data: arr
						});
					}
				});
				uni.request({
					url: app.globalData.url + 'search/result',
					data: {
						word: word,
						page: that.page,
						num: that.num,
						type:that.type
					},
					success: function(res) {
						let page = that.page;
						var content = that.info; //页码为1时
						if (page == 1) {
							content = [];
						}
						var info = res.data.data; //后台请求拿到的结果
						//如果请求的数据小于20  就提示没有更多数据 否则正在加载
						that.info = content.concat(info)
						if (page < res.data.lastPage) {
							that.page++
						}else{
							that.more = 'noMore'
						}
						if (that.info.length < that.num) {
							that.more = 'noMore'
						}
						that.display = 3
						
					},
					complete: function() {
						uni.hideLoading();
					}
				});
			},

			/**
			 * 获取结果
			 */
			comResult: function(e) {
				uni.showLoading({
					title: '加载中'
				});
				this.page = 1
				this.getInfo();
			},
			/**清除历史记录
			 * 
			 */
			clearHistory: function() {
				var that = this;
				uni.showModal({
					content: '清空历史记录',

					success(res) {
						if (res.confirm) {
							that.history = ''
							uni.setStorage({
								key: 'history',
								data: []
							});
						}
					}

				});
			},
		}
	};
</script>
<style>
	@import url('@/static/css/search.css');
</style>
