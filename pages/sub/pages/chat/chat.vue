<template>
	<view class="content">
		<view class="row" v-for="(v,k) in info">
			<view class="img">
				<image :src="v.img"></image>
			</view>
			<view class="text">
				<view>
					<u-icon name="weixin-circle-fill" color="#2ec04b" size="36" style="margin-right: 7rpx;"></u-icon>
					<text>{{v.name}}</text>
				</view>
				<view class="num">
					<u-icon name="man-add" color="#c3c3c3" size="30" style="margin-right: 7rpx;"></u-icon>{{v.num}}人
					<u-icon name="clock" color="#c3c3c3" size="30" style="margin: 7rpx;"></u-icon>{{v.min_time}}小时后失效
					<u-icon name="level" color="red" size="30"style="margin-left: 7rpx;" v-if="v.fee == 2"></u-icon>
				</view>
			</view>
			<view class="btn">
				<button class="other_btn" v-if="!v.join" @click="check(v.id)">加群</button>
				<button class="other_btn" v-else @click="check(v.id)">已加</button>
			</view>
		</view>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				info:[],
				page:''
			}
		},
		methods: {
			getInfo(){
				uni.request({
					url:app.globalData.url+'group_code/entry',
					data:{api_token:app.globalData.api_token},
					success(res) {
						uni.stopPullDownRefresh()
						if(res.data.result == -2){
							uni.navigateTo({
								url:'/pages/login/login'
							})
						}
						that.info = res.data.data
					}
				})
			},
			check(id){
				uni.navigateTo({
					url:'/pages/sub/pages/chat/detail?id='+id
				})
			}
		},
		onPullDownRefresh(){
			that.getInfo()
		},
		onLoad() {
			that = this;
			var pages = getCurrentPages()
			that.page = pages[pages.length - 1]
		},
		onShow() {
			uni.setStorage({
				key: 'url',
				data: '/' + that.page.route,
				success: function() {
					app.isLogin().then(function() {
						//app.checkLogin()
						that.getInfo()
					})
				}
			})
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	page{
		background-color: #f0f1f6;
	}
	.content{
		background-color: #fff;
		margin: 20rpx;
		border-radius: 18rpx;
		padding: 0 20rpx;
	}
	.row{
		display: flex;
		height: 172rpx;
		align-items: center;
		border-bottom: 1rpx #e4eeec dashed;
	}
	.row:last-child{
		border-bottom: 0;
	}
	.row .img image{
		width: 95rpx;
		height: 95rpx;
	}
	.row .text{
		margin-left: 26rpx;
		width: 347rpx;
		font-size: 34rpx;
		font-weight: bold;
	}
	
	.row .text>view>text{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 250rpx;
		display: inline-block;
		-o-text-overflow: ellipsis;
	}
	
	.row .text>view{
		display: flex;
	}
	
	.row .text .num{
		font-size: 28rpx;
		font-weight: normal;
		color: #c3c3c3;
		margin-top: 20rpx;
	}
</style>
