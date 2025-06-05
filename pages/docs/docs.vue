<template>
	<view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad(e) {
			if(e.type){
				e.data = 'https://xcx.huitengzx.com/storage/file/'+e.data
			}
			uni.downloadFile({
				url: e.data, //仅为示例，并非真实的资源
				success: (res) => {
					//console.log(res)
					if (res.statusCode === 200) {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: function(res) {
								var savedFilePath = res.savedFilePath
								uni.openDocument({
									filePath: savedFilePath,
									fail(res) {
										uni.showToast({
											title:'不支持打开该类型文件',
											icon:'none'
										})
									}
								})
							},fail(res) {
								
							}
						});
					}
				},
				fail(res) {
					//console.log(res)
				}
			});
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
