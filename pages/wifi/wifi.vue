<template>
	<view>
		
	</view>
</template>

<script>
	const app = getApp()
	var that
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		onGetWifiList(e){
			console.log(e)
		},
		onLoad(e){
			that = this
			uni.request({
				url:app.globalData.url+'wifi/detail',
				data:{id:e.id},
				success(res) {
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							uni.request({
								url:app.globalData.url+'wifi/record',
								method:'POST',
								data:{id:e.id,code:loginRes.code},
								success(res) {
									console.log(res)
								}
							})
						}
					});
					uni.startWifi({
						success(){
							uni.connectWifi({
								SSID:res.data.data.ssid,
								password:res.data.data.password,
								success(){
									uni.showToast({
										title:'连接成功'
									})
									uni.setNavigationBarTitle({
										title:'wifi:"'+res.data.data.ssid+'"连接成功!'
									})
									
									
								},
								fail(res){
									console.log(res)
								}
							})
						},
						fail(res){
							console.log(res)
						}
					})
				}
			})
		}
	}
</script>

<style>

</style>
