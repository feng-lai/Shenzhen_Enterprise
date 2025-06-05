<template>
	<view>
		<web-view :src="'https://xcx.huitengzx.com/contact_us?web='+web"></web-view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				web:''
			}
		},
		onShareAppMessage(){
			
		},
		methods: {
			
		},
		onShow(){
			
		},
		onLoad() {
			// #ifdef  H5
			this.web =  1 
			// #endif
		}
	}
</script>

<style>

</style>
