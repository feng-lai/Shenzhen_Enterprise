<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				img:''
			}
		},
		methods: {
			
		},
		onLoad(e) {
			uni.getImageInfo({
				src: e.img,
				success: function (image) {
					uni.saveImageToPhotosAlbum({
						filePath: image.path,
						success: function() {
							console.log('save success');
						},
						fail(res) {
							console.log(res);
						}
					});
				}
			})
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>
