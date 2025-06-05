<template>
	<view>
		<view class="form" v-show="show">
			<form>
				<view class="group">
					<view class="left text">*姓名</view>
					<view class="left">
						<input placeholder="请输入你的姓名" type="text" name="name" @input="change" data-type="name">
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*性别</view>
					<view class="left">
						<radio-group name="gender" @change="selects" data-type="gender">
							<radio value="1">男</radio>
							<radio value="2">女</radio>
						</radio-group>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*年龄</view>
					<view class="left">
						<input placeholder="请输入你的年龄" type="text" name="age" @input="change" data-type="age">
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*学历</view>
					<view class="left">
						<radio-group name="edu" @change="selects" data-type="edu">
							<radio value="1">小学</radio>
							<radio value="2">初中</radio>
							<radio value="3">高中</radio>
							<radio value="4">大专</radio>
							<radio value="5">本科</radio>
						</radio-group>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*婚否</view>
					<view class="left">
						<radio-group name="is_marry" @change="selects" data-type="is_marry">
							<radio value="-1">未婚</radio>
							<radio value="1">已婚</radio>
						</radio-group>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*电话</view>
					<view class="left"><input type="text" placeholder="请输入联系电话" name="phone" @input="change" data-type="phone"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*现居城市</view>
					<view class="left"><input type="text" placeholder="请输入城市" name="city" @input="change" data-type="city"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*期望月薪</view>
					<view class="left"><input type="text" placeholder="请输入期望月薪" name="salary"  @input="change" data-type="salary"></view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left">
						<checkbox-group @change="agree">
							<label>
								<checkbox name="agree" color="#FFCC33" value="1" style="transform:scale(0.7)"/>同意将以上信息发给招聘用户
							</label>
						</checkbox-group>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view style="color: red; display: flex;"><navigator hover-class="none" url="/pages/work/agreement?type=2">《用户服务协议》</navigator>及<navigator  hover-class="none" url="/pages/work/agreement?type=1">《隐私政策》</navigator></view>
				</view>
				<view class="submit">
					<button class="other_btn" @click="getUserProfile">确认</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	var that
	export default {
		data() {
			return {
				id:'',
				userInfo:'',
				form_data:{name:'',gender:'',age:'',edu:'',is_marry:'',phone:'',city:'',salary:'',agree:''},
				show:false
			}
		},
		methods: {
			change(e){
				let type = e.currentTarget.dataset.type
				switch(type){
					case 'name':
						that.form_data.name = e.detail.value
					break;
					case 'phone':
						that.form_data.phone = e.detail.value
					break;
					case 'age':
						that.form_data.age = e.detail.value
					break;
					case 'city':
						that.form_data.city = e.detail.value
					break;
					case 'salary':
						that.form_data.salary = e.detail.value
					break;
				}
				
			},
			selects(e){
				let type = e.currentTarget.dataset.type
				switch(type){
					case 'gender':
						that.form_data.gender = e.detail.value
					break;
					case 'edu':
						that.form_data.edu = e.detail.value
					break;
					case 'is_marry':
						that.form_data.is_marry = e.detail.value
					break;
				}
			},
			agree(e){
				that.form_data.agree = e.detail.value[0]
			},
			getUserProfile(e){
				wx.requestSubscribeMessage({
					tmplIds: ['rLDEIFQYrkw_DS1TdHlTTucSJCD91z5YykiiCalA38U'],
					complete(res){
						if(!app.globalData.api_token){
							if(!that.userInfo){
								wx.getUserProfile({
									desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
									success: (res) => {
										console.log(res)
										that.userInfo = JSON.parse(res.rawData)
										wx.login({
											success(ros) {
												let data = that.userInfo
												data.code = ros.code
												that.login(JSON.stringify(data))
											}
										})
									}
								})
							}else{
								wx.login({
									success(ros) {
										let data = that.userInfo
										data.code = ros.code
										that.login(JSON.stringify(data))
									}
								})
							}
							return;
						}else{
							that.submit()
						}
					}
				})
			},
			login(info) {
				var that = this
				uni.request({
					url: app.globalData.url + 'login',
					method: 'post',
					data: info,
					success(res) {
						if (res.data.result == 1) {
							uni.setStorage({
								key: 'api_token',
								data: res.data.data,
								success() {
									app.globalData.api_token = res.data.data
									that.submit()
								}
							})
						}
					}
				})
			},
			submit(){
				if(!that.form_data.name){
					uni.showToast({
						title:'请填写姓名',
						icon:'none'
					})
					return;
				}
				if(!that.form_data.gender){
					uni.showToast({
						title:'请选择性别',
						icon:'none'
					})
					return;
				}
				if(!that.form_data.age){
					uni.showToast({
						title:'请填写年龄',
						icon:'none'
					})
					return;
				}
				if(!that.form_data.edu){
					uni.showToast({
						title:'请选择学历',
						icon:'none'
					})
					return;
				}
				if(!that.form_data.is_marry){
					uni.showToast({
						title:'请选择婚否',
						icon:'none'
					})
					return;
				}
				if(!that.form_data.phone){
					uni.showToast({
						title:'请填写电话',
						icon:'none'
					})
					return;
				}
				if(!that.form_data.city){
					uni.showToast({
						title:'请填写现居城市',
						icon:'none'
					})
					return;
				}
				if(!that.form_data.salary){
					uni.showToast({
						title:'请填写期望月薪',
						icon:'none'
					})
					return;
				}
				if(!that.form_data.agree){
					uni.showToast({
						title:'请勾选同意',
						icon:'none'
					})
					return;
				}
				uni.showLoading()
				let data = that.form_data
				data.api_token = app.globalData.api_token
				data.uid = that.id
				uni.request({
					url:app.globalData.url+'work/add',
					method:'POST',
					data:data,
					success(res) {
						if(res.data.result == 1){
							setTimeout(function(){
								uni.redirectTo({
									url:'/pages/index/index'
								})
							},1000)
						}
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			getView(){
				uni.request({
					url:app.globalData.url + 'view',
					success(res) {
						if(res.data.data == 1){
							that.show = true
							uni.setNavigationBarTitle({
								title:'信息登记'
							})
						}
					}
				})
			}
		},
		onLoad(e) {
			that = this
			that.id = e.id
			that.getView()
			if(!that.show){
				uni.setNavigationBarTitle({
					title:''
				})
			}
		},
		onShow() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			uni.setStorage({
				key: 'url',
				data: '/' + page.route+'?id='+that.id,
				success: function() {
					app.isLogin().then(function() {
						//app.checkLogin()
						
					})
				}
			})
		}
	}
</script>

<style>
	@import url('@/static/css/work.css')
</style>
