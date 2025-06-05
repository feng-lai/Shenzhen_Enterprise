<template>
	<view>
		<u-parse :html="content"></u-parse>
	</view>
</template>

<script>
	const app = getApp()
	var that
	export default {
		data() {
			return {
				type:'',
				content:''
			}
		},
		methods: {
			
		},
		onLoad(e) {
			that = this
			that.type = e.type?e.type:'' 
			uni.request({
				url:app.globalData.url+'work/agreement',
				success(res) {
					if(that.type == 1){
						that.content = res.data.data.policy
						uni.setNavigationBarTitle({
						    title: '隐私政策'
						});
					}else{
						that.content = res.data.data.agreement
						uni.setNavigationBarTitle({
						    title: '用户服务协议'
						});
					}
					
				}
			})
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";

</style>
