<template>
	<view>
		<view class="top" v-for="(v,k) in info" v-if="v.view == 1 && v.name=='公司名称'">
			<image src="https://xcx.huitengzx.com/images/companys.png"></image>
			<text>{{v.content}}</text>
			<button class="right button" open-type="share">
				<uni-icons type="redo-filled" size="16" color="#43a0fd"></uni-icons>
			</button>
		</view>
		<block v-for="(v,k) in info" v-if="v.name!='公司名称' && v.view == 1">
			<view class="row" v-if="v.name == '法人身份证'">
				<view class="title">{{v.name}}</view>
				<view class="detail">
					<view class="left">
						<image :src="'https://xcx.huitengzx.com/storage/company/'+v.content" mode="aspectFit" style="width:300rpx; height:300rpx;"></image>
					</view>
					<view class="clear"></view>
				</view>
			</view>
			<view class="row" v-else-if="v.name == '营业执照'">
				<view class="title">{{v.name}}</view>
				<view class="detail">
					<view class="left">
						<image :src="'https://xcx.huitengzx.com/storage/company/'+v.content" mode="aspectFit" style="width:300rpx; height:300rpx;"></image>
					</view>
					<view class="clear"></view>
				</view>
			</view>
			<view class="row" v-else-if="v.name == 'tag词'">
				<view class="title">{{v.name}}</view>
				<view class="detail">
					<view class="left">
						<block v-for="(val,key) in v.content.split(',')">
							<navigator class="text" hover-class="none" :url="'/pages/tag/tag?tag='+val">{{val}}</navigator>
						</block>
					</view>
					<view class="clear"></view>
				</view>
			</view>
			<view class="row" v-else-if="v.name == '公司相册'">
				<view class="title">{{v.name}}</view>
				<view class="detail imgList">
					<block v-for="(val,key) in v.content">
						<view class="img">
							<view class="row">
								<image :src="'https://xcx.huitengzx.com/storage/company/'+val.img" @click="preview(key)"></image>
							</view>
						</view>
					</block>
				</view>
			</view>
			<view class="row" v-else>
				<view class="title">{{v.name}}</view>
				<view class="detail">
					{{v.content?v.content:''}}
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
				info:{}
			}
		},
		methods: {
			getInfo(){
				var that = this
				uni.request({
					url:app.globalData.url+'company/detail',
					data:{api_token:app.globalData.api_token,id:that.id},
					success(res) {
						if(res.data.result == 1){
							that.info = res.data.field
						}
					}
				})
			},
			preview(k){
				let img = ''
				for(let i in that.info){
					if(that.info[i].name=='公司相册'){
						img = that.info[i].content
					}
				}
				let data = []
				for(let i in img){
					data.push('https://xcx.huitengzx.com/storage/company/'+img[i].img)
				}
				uni.previewImage({
					urls: data,
					current:k
				});
			}
		},
		onShareAppMessage(){
			let title = ''
			let img = ''
			for(let i in that.info){
				if(that.info[i].name=='公司名称'){
					title = that.info[i].content
				}
				if(that.info[i].name=='公司相册'){
					img = that.info[i].content
				}
			}
			return {
			  title: title,
			  path: '/company/company?id='+that.id,
			  imageUrl:'https://xcx.huitengzx.com/storage/company/'+img[0].img
			}
		},
		onShareTimeline(){
			let title = ''
			let img = ''
			for(let i in that.info){
				if(that.info[i].name=='公司名称'){
					title = that.info[i].content
				}
				if(that.info[i].name=='公司相册'){
					img = that.info[i].content
				}
			}
			return {
			  title: title,
			  query: 'id='+that.id,
			  imageUrl:'https://xcx.huitengzx.com/storage/company/'+img[0].img
			}
		},
		onShow() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			var that = this; //是否已登录
			uni.setStorage({
				key: 'url',
				data: '/' + page.route+'?id='+that.id,
				success: function() {
					app.isLogin().then(function() {
						that.getInfo()
					})
				}
			})
		},
		onLoad(e) {
			that = this
			that.id = e.id
		}
	}
</script>

<style>
	@import url('@/static/css/company.css')
</style>
