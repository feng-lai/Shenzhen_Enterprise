<template>
	<view>
		<view style="width: 750rpx; overflow: hidden;">
			<web-view :src="'https://xcx.huitengzx.com/article?id='+id+'&api_token='+api_token+'&invite_id='+invite_id">
			</web-view>
		</view>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				id:'',
				api_token:'',
				interstitialAd:'',
				invite_id:''
			}
		},
		onShareAppMessage(){
			
		},
		methods: {
			
		},
		onShow(){
			
		},
		onLoad(e) {
			that = this
			that.id = e.id
			that.api_token = e.api_token
			that.invite_id = e.invite_id
			uni.setStorage({
			  key: 'url',
			  data: '/pages/activity/activity?article_id='+that.id+'&invite_id='+that.invite_id
			})
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>
