<template>
	<view>
		<uni-list v-if="info.length">
			<block v-for="(v,k) in info">
				<uni-list-item :title="v.content" :note="v.created_at"></uni-list-item>
			</block>
		</uni-list>
		<view style="width: 100%;">
			<uni-load-more :status="more" :contentText="contentText"></uni-load-more>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		data() {
			return {
				info:[],
				num:10,
				page:1,
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
		methods: {
			
		},
		onShow() {
			var that = this
			uni.setStorage({
				key: 'url',
				data: '/pages/notice/notice',
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin()
						uni.request({
							url:app.globalData.url+'notice/entry',
							data:{api_token:app.globalData.api_token,page:that.page,num:that.num},
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
					})
				}
			})
			
		}
	}
</script>

<style>

</style>
