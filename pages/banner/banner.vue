<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
			}
		},
		onShareAppMessage(){
			
		},
		methods: {
			
		},
		onLoad(e) {
			this.url = e.url
		}
	}
</script>

<style>

</style>
