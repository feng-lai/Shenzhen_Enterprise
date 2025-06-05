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
				url:app.globalData.url+'project/agreement',
				success(res) {
					if(that.type){
						that.content = res.data.data.content2
						uni.setNavigationBarTitle({
						    title: '确定合作的协议'
						});
					}else{
						that.content = res.data.data.content
					}
					
				}
			})
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";

</style>
