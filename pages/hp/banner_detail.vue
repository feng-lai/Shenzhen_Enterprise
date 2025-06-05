<template>
	<view>
		<image :src="img" :style="'height:'+height+'rpx'"></image>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				img:'',
				height:'',
				id:'',
				type:'',
				name:''
			}
		},
		methods: {
			footprint(){
				uni.request({
					method:'POST',
					url:app.globalData.url+'hp/footprint',
					data:{id:that.id,type:that.type,api_token:app.globalData.api_token,to_uid:that.to_uid},
					success(res) {
						
					}
				})
			}
		},
		onLoad(e) {
			that = this 
			that.img = decodeURIComponent(e.img)
			that.id = e.id
			that.type = e.type
			that.name = e.name
			that.to_uid = e.to_uid
			uni.setStorage({
				key: 'url',
				data: '/pages/hp/banner_detail?img='+that.img+'&id='+that.id+'&type='+that.type+'&to_uid='+that.to_uid,
				success: function() {
					app.isLogin().then(function() {
						if(app.globalData.api_token){
							that.footprint()
						}
						uni.getImageInfo({
							src:that.img,
							success(e) {
								that.height = e.height
								console.log(e.height)
							}
						})
					})
				}
			})
		},
		onShareAppMessage() {
			return {
				title:that.name,
				imageUrl:that.img
			}
		},
		onShareTimeline(res) {
			return {
				title:that.name,
				query: 'img='+that.img+'&id='+that.id+'&type='+that.type+'&to_uid='+that.to_uid,
				imageUrl:that.img
			}
		},
	}
</script>

<style>
	image{width: 100%;}
</style>