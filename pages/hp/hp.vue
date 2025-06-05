<template>
	<view>
		<navigator class="to_login" url="/pages/login/login" hover-class="none" v-if="!is_login"></navigator>
		<view class="card" v-if="card">
			<view class="content" v-if="card.style == 1">
				<view class="line1"></view>
				<view class="line2"></view>
				<view class="company">
					<image :src="url+card.logo" @click="view(url+card.logo)"></image>
					<view class="row">
						<view>{{card.tag}}</view>
						<view>{{card.cname}}</view>
					</view>
				</view>
				<view class="user">
					<view class="line"></view>
					<view class="name">
						<view class="part">
							<text>{{card.name}}</text>
						</view>
						<view class="part part2">
							<view>{{card.en_name}}</view>
							<view>{{card.posts}}</view>
						</view>
					</view>
				</view>
				<view class="other">
					<view><u-icon name="phone" class="phone" color="#fff" size="14"></u-icon>{{card.phone}}</view>
					<view><u-icon name="weixin-circle-fill" color="#5ecd3e" size="24"></u-icon>{{card.wx}}</view>
					<view><u-icon name="map-fill" color="#eb3223" size="24"></u-icon>{{card.address}}</view>
				</view>
				<u-image :src="'https://xcx.huitengzx.com/storage/invite_code/'+card.code" :show-menu-by-longpress="true" width="141rpx" height="160.5rpx" class="code" @click="view('https://xcx.huitengzx.com/storage/invite_code/'+card.code)" mode="aspectFit"></u-image>
			</view>
			<view class="content" v-if="card.style == 2">
				<view class="content2">
					<view>
						<view class="c_name">{{card.cname}}</view>
						<view class="text">
							<view class="name">{{card.name}}{{card.en_name}}</view>
							<view class="tag">{{card.tag}}</view>
							<view class="o"><i></i>电话：{{card.phone}}</view>
							<view class="o"><i></i>微信：{{card.wx}}</view>
							<view class="o"><i></i>职位：{{card.posts}}</view>
							<view class="o"><i></i>地址：{{card.address}}</view>
						</view>
					</view>
					<view>
						<image :src="url+card.logo" @click="view(url+card.logo)" class="logo"></image>
						<u-image :src="'https://xcx.huitengzx.com/storage/invite_code/'+card.code" :show-menu-by-longpress="true" width="141rpx" height="160.5rpx" class="code" @click="view('https://xcx.huitengzx.com/storage/invite_code/'+card.code)" mode="aspectFit"></u-image>
					</view>
				</view>
				<view class="bottom">
					<view class="bg1"></view>
					<view class="bg2"></view>
				</view>
			</view>
			<view class="content" v-if="card.style == 3">
				<view class="content3">
					<view class="c_left">
						<view class="cname">{{card.cname}}</view>
						<view class="name">{{card.name}}{{card.en_name}}</view>
						<view class="tag">{{card.tag}}</view>
						<view class="o">电话<text>{{card.phone}}</text></view>
						<view class="o">微信<text>{{card.wx}}</text></view>
						<view class="o">职位<text>{{card.posts}}</text></view>
						<view class="o">地址<text>{{card.address}}</text></view>
					</view>
					<view>
						<u-image :src="'https://xcx.huitengzx.com/storage/invite_code/'+card.code" :show-menu-by-longpress="true" width="141rpx" height="160.5rpx" class="code" @click="view('https://xcx.huitengzx.com/storage/invite_code/'+card.code)" mode="aspectFit"></u-image>
						<image :src="url+card.logo" @click="view(url+card.logo)" class="logo"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="swiper" v-if="banner.length">
			<u-swiper :list="banner" :duration="duration" :circular="circular" indicator-pos="bottomRight" :autoplay="autoplay" :interval="interval" @click="to_banner_detail"></u-swiper>
		</view>
		<view class="company_info" v-if="profile">
			<view class="title">
				{{config.profile}}
				<navigator class="more" v-if="profile.img" :url="'/pages/hp/banner_detail?id='+profile.id+'&type=4&img='+profile.img+'&name='+card.cname+'&to_uid='+id">更多 ></navigator>
			</view>
			<view class="content" v-if="profile.style == 1">
				<view class="dsc">{{profile.content}}</view>
			</view>
			<view class="content2" v-if="profile.style == 2">
				<view class="dsc">{{profile.content}}</view>
			</view>
			<view class="content3" v-if="profile.style == 3">
				<view class="dsc">{{profile.content}}</view>
			</view>
		</view>
		<view class="product" v-if="product.length">
			<view class="title">
				{{config.product}}
			</view>
			<view class="content">
				<view class="row" v-for="(v,k) in product">
					<navigator style="display: inline-block;" hover-class="none" :url="'/pages/hp/product_detail?to_uid='+id+'&id='+v.id+'&name='+card.cname"><image :src="url+v.img"></image></navigator>
					<view class="right">
						<navigator class="name" hover-class="none" :url="'/pages/hp/product_detail?id='+v.id">{{v.name}}</navigator>
						<navigator class="tag"><text v-for="(val,key) in v.tag.split(',')" v-if="key < 4">{{val}}</text></navigator>
						<view class="talk"><text class="other_btn" @click="call(v.phone)">电话联系</text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="video" v-if="video.length" style="padding: 0 20rpx;">
			<view class="title">
				{{config.video}}
			</view>
			<view class="content">
				<view class="row" v-for="(v,k) in video">
					<view class="video"><video :src="url+v.url" :poster="url+v.img"></video></view>
					<view class="text">
						{{v.title}}
					</view>
				</view>
			</view>
		</view>
		<view class="team" v-if="team">
			<view class="title">
				{{config.team}}
			</view>
			<view class="content">
				<view class="swiper">
					<u-swiper :list="team.img" :duration="duration" height="276" :circular="circular" indicator-pos="bottomRight" :autoplay="autoplay" :interval="interval" :effect3d="true" bg-color="#fff"></u-swiper>
				</view>
				<view class="dsc">
					{{team.content}}
				</view>
			</view>
		</view>
		<view class="recruit" v-if="recruit.length">
			<view class="title">
				{{config.recruit}}
			</view>
			<view class="content">
				<view class="row" v-for="(v,k) in recruit" @click="to_detail(v.id,url+v.img,3)">
					<view class="top">
						<text class="post">{{v.posts}}</text>
						<text>{{v.salary}}</text>
					</view>
					<view>{{v.num}}人</view>
					<view>{{v.address}}</view>
				</view>
				<view class="contact" @click="call(card.phone)">
					<u-icon name="phone-fill" color="#fff" size="20"></u-icon>立即联系 
				</view>
			</view>
		</view>
		<ad unit-id="adunit-70b0aa4822bb618e"></ad>
		<!--<view class="contacts">
			<view class="title">
				联系我们
			</view>
			<view class="content">
				<view class="ci"><image src="../../static/image/cicon.png"></image>{{card.cname}}</view>
				<view class="ca"><image src="../../static/image/caddress.png"></image>{{card.address}}</view>
				<map class="map" :show-location="true" :latitude="latitude" :longitude="longitude"></map>
			</view>
		</view>-->
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				id:'',
				video:'',
				banner:[],
				recruit:'',
				profile:'',
				card:'',
				product:'',
				team:'',
				url:'https://xcx.huitengzx.com/storage/hp/',
				config:{},
				is_login:false
			}
		},
		methods: {
			footprint(){
				uni.request({
					method:'POST',
					url:app.globalData.url+'hp/footprint',
					data:{id:that.id,type:5,api_token:app.globalData.api_token,to_uid:that.id},
					success(res) {
						
					}
				})
			},
			view(url){
				uni.previewImage({
					urls:[url],
					showmenu:true
				})
			},
			getInfo(){
				uni.request({
					url:app.globalData.url+'hp',
					data:{id:that.id},
					success(res) {
						if(res.data.result == 1){
							that.video = res.data.data.video
							that.banner = res.data.data.banner
							that.recruit = res.data.data.recruit
							that.profile = res.data.data.profile
							that.card = res.data.data.card
							that.product = res.data.data.product
							that.team = res.data.data.team
							uni.setNavigationBarTitle({
								title: res.data.data.card.cname
							});
						}
					}
				})
			},
			to_banner_detail(e){
				uni.navigateTo({
					url:'/pages/hp/banner_detail?img='+that.banner[e].image2+'&id='+that.banner[e].id+'&type=1'+'&name='+that.card.cname+'&to_uid='+that.id
				})
			},
			to_detail(id,img,type){
				uni.navigateTo({
					url:'/pages/hp/banner_detail?img='+img+'&id='+id+'&type='+type+'&name='+that.card.cname+'&to_uid='+that.id
				})
			},
			call(phone){
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			getConfig(){
				uni.request({
					url:app.globalData.url+'hp/config',
					data:{uid:that.id},
					success(res) {
						if(res.data.result == 1){
							that.config = res.data.data
						}
					}
				})
			}
		},
		onLoad(e) {
			that = this
			that.id = e.id
			that.getInfo()
			that.getConfig()
			
		},
		onShow() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			uni.setStorage({
				key: 'url',
				data: '/' + page.route+'?id='+that.id,
				success: function() {
					app.isLogin().then(function() {
						if(app.globalData.api_token){
							that.footprint()
							that.is_login = true
						}
					})
				}
			})
			
		},
		onShareAppMessage() {
			return {
				title:that.card.cname,
				imageUrl:that.banner.length?that.banner[0].img:'https://xcx.huitengzx.com/storage/invite_code/'+that.card.code
			}
		},
		onShareTimeline(){
			return {
				title:that.card.cname,
				imageUrl:that.banner.length?that.banner[0].image:'https://xcx.huitengzx.com/storage/invite_code/'+that.card.code
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import url('@/static/css/hp.css')
</style>
