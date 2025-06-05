<template>
	<view>
		<web-view :src="'https://xcx.huitengzx.com/card?api_token='+api_token"></web-view>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				api_token: '',
			}
		},
		methods: {
			
		},
		onShow() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			uni.setStorage({
				key: 'url',
				data: '/' + page.route,
				success: function() {
					app.isLogin().then(function() {
						that.api_token = app.globalData.api_token
					})
				}
			})
		},
		onLoad(e) {
			that = this
		},
		onShareAppMessage() {

		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import url('@/static/css/card.css');
</style>
