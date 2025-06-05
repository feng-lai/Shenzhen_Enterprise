<template>
	<view>
		<view class="top" v-for="(v,k) in info" v-if="v.view == 1 && v.name=='公司名称'">
			<image src="https://xcx.huitengzx.com/images/companys.png"></image>
			<text>{{v.content}}</text>
			<uni-icons type="compose" size="20" color="#43a0fd" @click="vis(v.id,v.name,v.content)"></uni-icons>
			<view class="right">
				<uni-icons type="redo-filled" size="16" color="#43a0fd"></uni-icons>
			</view>
		</view>
		<block v-for="(v,k) in info" v-if="v.name!='公司名称'">
			<view class="row" v-if="v.name == '法人身份证'">
				<view class="title">{{v.name}}</view>
				<view class="detail">
					<view class="left">
						<image :src="'https://xcx.huitengzx.com/storage/company/'+v.content" mode="aspectFit" style="width:300rpx; height:300rpx;" @click="preview('https://xcx.huitengzx.com/storage/company/'+v.content)"></image>
					</view>
					<view class="right"><button @click="vis(v.id,v.name,v.content)" class="other_btn">编辑</button></view>
					<view class="clear"></view>
				</view>
			</view>
			<view class="row" v-else-if="v.name == '营业执照'">
				<view class="title">{{v.name}}</view>
				<view class="detail">
					<view class="left">
						<image :src="'https://xcx.huitengzx.com/storage/company/'+v.content" mode="aspectFit" style="width:300rpx; height:300rpx;" @click="preview('https://xcx.huitengzx.com/storage/company/'+v.content)"></image>
					</view>
					<view class="right"><button @click="vis(v.id,v.name,v.content)" class="other_btn">编辑</button></view>
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
					<view class="right"><button @click="vis(v.id,v.name,v.content)" class="other_btn">编辑</button></view>
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
							<view class="row option">
								<uni-icons type="compose" size="16" @click="viewImg(val.id,val.title,val.desc,val.img,val.main)"></uni-icons>
								<uni-icons type="trash" size="16" @click="delImg(val.id)"></uni-icons>
							</view>
						</view>
					</block>
				</view>
			</view>
			<view class="row" v-else>
				<view class="title">{{v.name}}</view>
				<view class="detail">
					{{v.content?v.content:''}}
					<view class="right"><button @click="vis(v.id,v.name,v.content)" class="other_btn">编辑</button></view>
				</view>
			</view>
		</block>
		<e-modal :visible.sync="visible" @cancel="handleCancel">
			<view class="model">
				<view class="group">
					<view class="left text">*名称</view>
					<view class="left">
						<input type="text" :value="imagedit.title" placeholder="请输入名称" @input="imgTitle">
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*设为主图</view>
					<view class="left">
						<checkbox-group @change="imgMain">
							<checkbox value="main" checked="true" v-if="imagedit.main == 1"/>
							<checkbox value="main" v-else/>
						</checkbox-group>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*说明</view>
					<view class="left">
						<textarea :value="imagedit.desc" @input="imgDesc" style="width: 500rpx;"></textarea>
					</view>
					<view class="clear"></view>
				</view>
				<view class="group">
					<view class="left text">*附件</view>
					<view class="left">
						<view><button @click="upload2()" class="other_btn">点击上传</button></view>
						<view class="preview">
							<view class="left">预览</view>
							<view class="img">
								<image :src="'https://xcx.huitengzx.com/storage/company/'+imagedit.img">
							</view>
							<view class="clear"></view>
						</view>
					</view>
					<view class="clear"></view>
				</view>
				<view class="submit">
					<button class="other_btn" @click="imgSubmit()">确认</button>
					<button class="other_btn" @click="handleCancel()">取消</button>
				</view>
			</view>
		</e-modal>
		<e-modal :visible.sync="visibles" @cancel="handleCancels">
			<view class="model">
				<view class="group">
					<view class="left text">*{{name}}</view>
					<view class="left">
						<button v-if="name == '法人身份证'" style="display: inline-block;" @click="upload">选择图片</button>
						<button v-else-if="name == '营业执照'" style="display: inline-block;" @click="upload">选择图片</button>
						<textarea v-else :value="content" :placeholder="'请输入'+name" @input="changev" style="width: 500rpx; line-height: 50rpx;"></textarea>
					</view>
					<view class="clear"></view>
					<view v-if="name == '法人身份证' || name == '营业执照'">
						<image :src="'https://xcx.huitengzx.com/storage/company/'+content" mode="aspectFit" style="width: 200rpx; height: 200rpx;"></image>
					</view>
				</view>
				<view class="submit">
					<button class="other_btn" @click="submit()">确认</button>
					<button class="other_btn" @click="handleCancels()">取消</button>
				</view>
			</view>
		</e-modal>
	</view>
</template>

<script>
	var that
	const app = getApp()
	export default {
		data() {
			return {
				visible: false,
				visibles: false,
				info: {},
				id: '',
				name: '',
				content:'',
				eid:'',
				imagedit: {
					id: '',
					img: '',
					title: '',
					desc: '',
					main:0
				},
			}
		},
		onShareAppMessage(){
			
		},
		methods: {
			viewImg(id, title, desc, img,main) {
				this.imagedit.id = id
				this.imagedit.title = title
				this.imagedit.desc = desc
				this.imagedit.img = img
				this.imagedit.main = main
				this.visible = true
			},
			imgTitle(e) {
				this.imagedit.title = e.detail.value
			},
			imgMain(e){
				this.imagedit.main = e.detail.value.length
				
			},
			imgSubmit() {
				var that = this
				let data = that.imagedit
				if (!data.title) {
					uni.showToast({
						title: '请填写标题',
						icon: 'none'
					})
					return;
				}
				if (!data.desc) {
					uni.showToast({
						title: '请填写描述',
						icon: 'none'
					})
					return;
				}
				if (!data.img) {
					uni.showToast({
						title: '请上传图片',
						icon: 'none'
					})
					return;
				}
				data.api_token = app.globalData.api_token
				data.cid = that.id
				uni.request({
					url: app.globalData.url + 'company/img/save',
					method: 'post',
					data: data,
					success(res) {
						if (res.data.result == 1) {
							that.getInfo()
							that.visible = false
						}
						uni.showToast({
							title: res.data.msg
						})
					}
				})

			},
			imgDesc(e) {
				this.imagedit.desc = e.detail.value
			},
			bindDateChange(e) {
				let type = e.currentTarget.dataset.type
				let data = e.detail.value
				if (!data) {
					return;
				}
				this.edit(type, data)
			},
			handleCancel() {
				this.visible = false
			},
			handleCancels() {
				this.visibles = false
			},
			handleCancelss() {
				this.visibless = false
			},
			ext_edit(id,name,names){
				this.extedit.id = id
				this.extedit.name = name
				this.extedit.names = names
				this.visibless = true
			},
			submitext(){
				var that = this
				if(!that.extedit.names){
					uni.showToast({
						title:'请填写'+that.extedit.name
					})
					return;
				}
				uni.request({
					url:app.globalData.url+'company/ext/save',
					method:'post',
					data:{api_token:app.globalData.api_token,id:that.extedit.id,names:this.extedit.names,cid:that.id},
					success(res) {
						if(res.data.result == 1){
							that.getInfo()
							that.visibless = false
						}
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			changevExt(e){
				this.extedit.names = e.detail.value
			},
			changev(e) {
				this.content = e.detail.value
			},
			getInfo() {
				var that = this
				uni.request({
					url: app.globalData.url + 'company/detail',
					data: {
						api_token: app.globalData.api_token,
						id: that.id
					},
					success(res) {
						if (res.data.result == 1) {
							that.info = res.data.field
						}
					}
				})
			},
			edit() {
				var that = this
				uni.request({
					url: app.globalData.url + 'company/save2',
					data: {
						api_token: app.globalData.api_token,
						name: that.content,
						id: that.id,
						eid:that.eid
					},
					method: 'post',
					success(res) {
						if (res.data.result == 1) {
							that.getInfo()
							that.visibles = false
						}
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
					}
				})
			},
			vis(id,name,content) {
				var that = this
				that.visibles = true
				that.name = name
				that.content = content
				that.eid = id
			},
			submit() {
				if (!this.content) {
					uni.showToast({
						title: '请输入' + this.name,
						icon: 'none'
					})
					return;
				}
				that.edit()
			},
			/**
			 * 上传文件
			 * 
			 */
			upload: function(type) {
				var that = this;
				uni.chooseImage({
					success(res) {
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: app.globalData.url + 'upload_company',
							filePath: tempFilePaths[0],
							name: 'file',
							success(res) {
								let info = JSON.parse(res.data)
								if (info.result == 1) {
									that.content = info.data.name
								}
								uni.showToast({
									title: info.msg,
									icon: 'none'
								})
							}
						});
					}

				});
			},
			/**
			 * 上传文件
			 * 
			 */
			upload2: function(type) {
				var that = this;
				uni.chooseImage({
					success(res) {
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: app.globalData.url + 'upload_company',
							filePath: tempFilePaths[0],
							name: 'file',
							success(res) {
								let info = JSON.parse(res.data)
								if (info.result == 1) {
									that.imagedit.img = info.data.name
								}
								uni.showToast({
									title: info.msg,
									icon: 'none'
								})
							}
						});
					}

				});
			},
			preview(img) {
				// 预览图片
				uni.previewImage({
					urls: [img],
				});
			},
			//删除相册 
			delImg(id){
				var that = this
				uni.showModal({
				    title: '确认删除？',
				    content: '是否删除该图片',
				    success: function (res) {
				        if (res.confirm) {
				            uni.request({
				            	url:app.globalData.url+'company/img/del',
								method:'post',
								data:{api_token:app.globalData.api_token,cid:that.id,id:id},
								success(res) {
									uni.showToast({
										title:res.data.msg,
										icon:'none'
									})
									if(res.data.result == 1){
										that.getInfo()
									}
								}
				            })
				        }
				    }
				});
			}
		},
		onShow() {
			var pages = getCurrentPages()
			var page = pages[pages.length - 1];
			var that = this; //是否已登录
			uni.setStorage({
				key: 'url',
				data: '/' + page.route + '?id=' + that.id,
				success: function() {
					app.isLogin().then(function() {
						app.checkLogin()
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
