<template>
	<view>
		<u-parse :html="content"></u-parse>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				content:''
			}
		},
		methods: {
			
		},
		onLoad() {
			that = this
			uni.request({
				url:app.globalData.url+'customer_info',
				success(res) {
					that.content = res.data.data
				}
			})
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";

</style>
