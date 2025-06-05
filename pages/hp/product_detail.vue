<template>
	<view>
		<block v-for="(v,k) in info">
			<view style="position: relative;">
				<view class="img" :style="'height:'+v.img[0].h+'rpx;'">
					<u-image :src="v.img[0].pic"  width="750rpx" :height="v.img[0].h+'rpx'" @click="view(v.img,key)"></u-image>
				</view>
				<!--<view :class="['code',v.code_style]" v-if="v.url">
					<u-image :src="v.code"  width="150rpx" height="150rpx" mode="aspectFit" @click="view([v.code],0)"></u-image>
				</view>
				<view :class="['url',v.url_style]" v-if="v.url">
					<u-image :src="v.url_code"  width="150rpx" height="150rpx" mode="aspectFit" @click="view([v.url_code],0)"></u-image>
				</view>-->
			</view>
			<view style="display: flex; justify-content: center; align-items: center; padding:20rpx; text-align: center;" v-if="v.price != 0">
				<view style="margin-right: 100rpx;">
					<u-image style="display: inline-block;" :src="v.code"  width="150rpx" height="150rpx" mode="aspectFit" @click="view([v.code],0)"></u-image>
					<view>{{v.price}}元</view>
					<view>点击打开，长按识别支付</view>
				</view>
				<view>
					<u-image style="display: inline-block;" :src="v.url_code"  width="150rpx" height="150rpx" mode="aspectFit" @click="view([v.url_code],0)"></u-image>
					<view>点击打开</view>
					<view>长按识别查看详情</view>
				</view>
			</view>
			
		</block>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				id:'',
				info:'',
				name:'',
				to_uid:''
			}
		},
		methods: {
			footprint(){
				uni.request({
					method:'POST',
					url:app.globalData.url+'hp/footprint',
					data:{id:that.id,type:2,api_token:app.globalData.api_token,to_uid:that.to_uid},
					success(res) {
						
					}
				})
			},
			getInfo(){
				uni.request({
					url:app.globalData.url+'hp_product_detail/entry',
					data:{id:that.id},
					success(res) {
						that.info = res.data.data
					}
				})
			},
			copy(text){
				uni.setClipboardData({
				    data: text,
				    success: function () {
				        uni.showToast({
				        	title:'复制成功',
							icon:'none'
				        })
				    }
				});
			},
			view(data,k){
				uni.previewImage({
					urls:data,
					current:k
				})
			}
		},
		onLoad(e) {
			that= this
			that.id = e.id
			that.name = e.name
			that.to_uid = e.to_uid
			uni.setStorage({
				key: 'url',
				data: '/pages/hp/product_detail?id='+that.id+'&name='+that.name+'&to_uid='+that.to_uid,
				success: function() {
					app.isLogin().then(function() {
						if(app.globalData.api_token){
							that.footprint()
						}
					})
				}
			})
		},
		onShow(){
			that.getInfo()
		},
		onShareAppMessage() {
			return {
				title:that.name,
				imageUrl:that.info[0].img[0].pic,
				path: 'pages/hp/product_detail?id='+that.id+'&name='+that.name+'&to_uid='+that.to_uid,
			}
		},
		onShareTimeline(res) {
			return {
				title:that.name,
				query: 'id='+that.id+'&name='+that.name+'&to_uid='+that.to_uid,
				imageUrl:that.info[0].img[0].pic
			}
		},
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	.img{
		display: flex;
		justify-content: space-around;
		align-items: center;
		min-height: 210rpx;
	}
	.code{
		position: absolute;
	}
	.url{
		position: absolute;
	}
	.tl{
		top: 20rpx;
		left: 20rpx;
	}
	.tr{
		top: 20rpx;
		right: 20rpx;
	}
	.bl{
		bottom: 20rpx;
		left: 20rpx;
	}
	.br{
		bottom: 20rpx;
		right: 20rpx;
	}
	.price{
		font-size: 46rpx;
		color: red;
		font-weight: bold;
		text-align: center;
	}
</style>