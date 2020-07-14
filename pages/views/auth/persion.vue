<template>
	<view>
		<cu-header :isBack="true" bgColor="bg-white">
			<block slot="content">个人认证</block>
			<block slot="right">
				<view class="text-green margin-right" @tap="numBack(num)" v-show="num != 0">上一步</view>
			</block>
		</cu-header>
		<view class="padding margin-top-xs bg-white">
			<view class="cu-steps">
				<view class="cu-item" :class="index>num?'':'text-blue'" v-for="(item,index) in numList" :key="index">
					<text class="num" :class="index==2?'err':''" :data-index="index + 1"></text> {{item.name}}
				</view>
			</view>
		</view>
		<view class="margin-top-xs bg-white" v-show="num == 0">
			<view class="cu-form-group">
				<input disabled class="text-gray" v-model="tel" />
			</view>
			<view class="cu-form-group">
				<input placeholder="输入姓名" v-model="user.name" />
			</view>
			<view class="cu-form-group">
				<input placeholder="输入身份证" type="idcard" v-model="user.no" />
			</view>
			<view class="padding-bottom">
				<button class="ctn bg-blue margin-xl" @click="numSteps(1)">下一步</button>
			</view>
		</view>
		<view class="margin-top-xs bg-white" v-show="num == 1">
			<view class="flex justify-center padding-top" @click="toAliPay()">
				<canvas canvas-id="qrcode" style="width: 215px;height: 215px; " />
			</view>
			<view class="text-lg margin-top-sm padding-xl"><text class="lg text-xs padding-right-sm text-blue cuIcon-info"></text> 支付宝页面认证成功后，点击或等待返回的结果，切记不要关闭支付宝</view>
			<view class="padding-bottom">
				<button class="ctn bg-blue margin-xl" @click="numSteps(2)" :disabled="authBack ? false : true">下一步</button>
			</view>
		</view>
		<view class="margin-top-xs bg-white" v-show="num == 2">
			<view class="cu-form-group">
				<input placeholder="请输入你的QQ号" type="number" v-model="postData.qq" />
			</view>
			<view class="cu-form-group" @click="open">
				<input placeholder="请选择联系地址" disabled="" v-model="region"/>
				<pickerAddress v-model="openAddress" @confirm="selectAddress" />
			</view>
			<view class="cu-form-group">
				<input placeholder="请输入详细地址" v-model="userAddress" />
			</view>
			<view class="cu-form-group">
				<input placeholder="请输入不少于6位支付密码" type="password" v-model="postData.paypwd" />
			</view>
			<view class="cu-form-group">
				<input placeholder="请再次输入支付密码" type="password" v-model="pwd"/>
			</view>
			<view class="padding-bottom">
				<button class="ctn bg-blue margin-xl" @click="apply">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/utils/js_sdk/Sansnn-uQRCode/uqrcode.js'
	import pickerAddress from '../../components/addres-popup/index.vue'
	
	export default {
		data() {
			return {
				num:0,
				tel:"",
				numList: [{
					name: '信息填写'
				}, {
					name: '扫码认证'
				}, {
					name: '资料提交'
				} ],
				user:{
					no:"330184199009164838",
					name:"黄建强"
				},
				url:"",
				authBack:false,
				stopLoop:false,
				postData:{
					qq:'',
					name:'',
					card:'',
					paypwd:'',
					address:''
				},
				form: {
					province: '',
					city: '',
					area: '',
				},
				region: "",
				userAddress:"",
				pwd:"",
				openAddress:false
			}
		},
		components: {
			pickerAddress
		},
		created() {
			this.initData()
		},
		methods: {
			numBack(e) {
				this.num = this.num > 0 ? this.num - 1 : 0
			},
			numSteps(e) {
				if (e == 1) {
					if (this.user.no == "" || this.user.name == "") {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '请填写用户信息'
						});
						return
					}
					this.$http.get("/v1/personal/auth/code", {params:this.user}).then(res => {
						if (res.data.code == 200) {
							// let authUrl = "alipays://platformapi/startapp?appId=20000067&url=" + res.data.data.data;
							// plus.runtime.openURL(authUrl);
							//this.num = this.num == this.numList.length - 1 ? 0 : this.num + 1
							this.url = res.data.data.data
							uQRCode.make({
								canvasId: 'qrcode',
								componentInstance: this,
								text: this.url,
								size: 215,
								margin: 10,
								backgroundColor: '#ffffff',
								foregroundColor: '#000000',
								fileType: 'jpg',
								correctLevel: uQRCode.defaults.correctLevel,
								success: res => {
								  
								}
							})
							this.num = 1
							this.countDown()
						} else {
						  uni.showToast({
								icon: 'none',
								position: 'center',
								title: res.data.message
						  });
						}
					})
				}
				if (e == 2) {
					this.num = 2
				}
			},
			initData() {
				this.$http.get(process.env.USER_API + '/v1/personal/user/info').then(res => {
					if (res.data.code == 200) {
						this.tel = res.data.data.data.user_phone
					} else {
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: '获取信息失败,请返回再试'
						});
					}
				})
			},
			toAliPay() {
				let authUrl = "alipays://platformapi/startapp?appId=20000067&url=" + this.url
				plus.runtime.openURL(authUrl);
			},
			authBackStatus() {
				this.$http.get("/v1/personal/auth/status", {params:this.user}).then(res => {
					if (res.data.code == 11601) {
						uni.showToast({
							icon: '',
							position: 'bottom',
							title: '正在查询中'
						})
						return
					}
					this.stopLoop = true
					if (res.data.code == 200) {
						uni.showToast({
							icon: 'success',
							position: 'bottom',
							title: '验证通过,请点击下方按钮完成认证'
						});
						this.authBack = true
					} else {
						uni.showToast({
							icon: 'success',
							position: 'bottom',
							title: res.data.message
						});
					}
				});
			},
			countDown() {
				this.authBackStatus()
				let that = this
				if (!this.stopLoop) {
					setTimeout(function() {
	                    that.countDown()
	                }, 5000)
				}
			},
			open(e) {
				this.openAddress = true
			},
			selectAddress(obj) {
				let arr = [ 'province', 'city', 'area'];
				let place = '';
				arr.map(key => {
					this.form[key] = obj[key].AreaId
					place += obj[key].AreaName + "*"
				})
				this.region = place
			},
			apply() {
				if (this.postData.qq == "") {
					uni.showToast({
						icon: 'none',
						position: 'center',
						title: 'QQ号不能为空'
					})
					return
				}
				if (this.region == "") {
					uni.showToast({
						icon: 'none',
						position: 'center',
						title: '请选择联系地址'
					})
					return
				}
				if (this.userAddress == "") {
					uni.showToast({
						icon: 'none',
						position: 'center',
						title: '详细地址不能为空'
					})
					return
				}
				if (this.postData.paypwd == "") {
					uni.showToast({
						icon: 'none',
						position: 'center',
						title: '支付密码不能为空'
					})
					return
				}
				if (this.postData.paypwd.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'center',
						title: '支付密码少于6位'
					})
					return
				}
				if (this.postData.paypwd != this.pwd) {
					uni.showToast({
						icon: 'none',
						position: 'center',
						title: '二次输入的支付密码不一致'
					})
					return
				}
				this.postData.address =  this.region + this.userAddress
				this.postData.name = this.user.name
				this.postData.card = this.user.no
				this.$http.post("/v1/personal/auth/personal", this.postData).then(res => {
				  if (res.data.code == 200) {
					uni.showToast({
						icon: 'success',
						position: 'center',
						title: '提交成功'
					})
					uni.reLaunch({
						url:'../index/index'
					})
				  } else {
				    uni.showToast({
				    	icon: 'none',
				    	position: 'center',
				    	title: res.data.message
				    })
				  }
				});
			}
		}
	}
	
	
</script>

<style>
	@import "../../../colorui/animation.css";
	.cu-form-group {
		margin:5rpx 80rpx;
	}
</style>
