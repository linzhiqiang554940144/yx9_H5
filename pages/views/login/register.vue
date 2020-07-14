<template>
	<view class="register">
		<cu-header :isBack="true" bgColor="bg-white">
			<block slot="backText"></block>
			<block slot="content">注册</block>
		</cu-header>
		<view class="login bg-white">
			<view class="content">
				<view class="main">
					<view class="cu-form-group">
						<input class="uni-input" type="number" maxlength="11" v-model="phoneData" placeholder="请输入手机号" />
					</view>
					<view class="cu-form-group">
						<input class="uni-input" type="number" maxlength="6" v-model="smsCode" placeholder="请输入验证码" />
						<button class='cu-btn bg-blue shadow' :disabled="isSend ? true : false" :class="isSend ? 'sendSms' : ''" @click="sendCode">{{codeTxt}}</button>
					</view>
					<view class="text-df margin-top agreement flex">
						<view @click="agreeService" class="cuIcon-roundcheck margin-right-xs margin-top" :class="agree.service ? 'text-blue' :''"></view>
						<view @click="agreeService">我已阅读并接受</view>
						<navigator hover-class='none' url="./agreement?type=0" navigateTo>
							<view>《游嬉久平台服务协议》</view>
						</navigator>
					</view>
					<view class="text-df agreement flex">
						<view @click="agreeExtend" class="cuIcon-roundcheck margin-right-xs margin-top-sm" :class="agree.extend ? 'text-blue' :''"></view>
						<view @click="agreeExtend">我已阅读并接受</view>
						<navigator hover-class='none' url="./agreement?type=1'" navigateTo>
							<view>《游嬉久平台推广合作协议》</view>
						</navigator>
					</view>
				</view>
				<wButton 
					text="注册"
					:rotate="isRotate" 
					@click.native="register()"
					class="wbutton"
				></wButton>
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	
	export default {
		data() {
			return {
				phoneData:'',
				smsCode:'',
				isRotate: false,
				codeTxt:'获取验证码',
				timeCount:60,
				isSend:false,
				agree:{
					service:false,
					extend:false
				}
			};
		},
		components:{
			wInput,
			wButton,
		},
		methods: {
			register() {
				if(this.isRotate){
					return false;
				}
				if (this.phoneData.length == "") {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号不能为空'
					});
					return;
				}
				if (this.smsCode.length != 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '验证码必须是6位'
					});
					return;
				}
				if (!this.agree.service || !this.agree.extend) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请先阅读并接受协议后再提交'
					});
					return;
				}
				this.isRotate=true
				let that = this
				
				setTimeout(function(){
					that.$http.post(process.env.USER_API + '/v1/user/register',{tel: that.phoneData,code:that.smsCode }).then(res => {
						that.isRotate = false
						if (res.data.code != 200) {
							if (res.data.code == 11002) {
								that.smsCode = ""
								that.timeCount = 0
							}
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: res.data.message
							});
							return;
						}
						uni.setStorageSync('token', res.data.data.data);
						//todo Check userInfo
						
						uni.reLaunch({
							url:'../index/index'
						})
					})
					.catch(err => {
						console.log(err)
					})
				},500)
			},
			sendCode() {
				this.$http.get("/v1/tel/code", {params:{
				  tel: this.phoneData,
				  type: "1"
				}}).then(res => {
				  if (res.data.code == 200) {
					this.countDown()
				  } else {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: res.data.message
					})
				  }
				})
            },
			countDown() {
				this.isSend = true
                if(this.timeCount == 0) {
					this.isSend = false
                    this.codeTxt = '获取验证码'
                    this.timeCount = 60;
                    return false;
                } else {
					this.codeTxt = '重新获取(' + this.timeCount + 's)'
                    this.timeCount--
                }
				let that = this
                setTimeout(function() {  
                    that.countDown()
                }, 1000)
			},
			agreeService() {
				this.agree.service  = this.agree.service ? false : true
			},
			agreeExtend() {
				this.agree.extend  = this.agree.extend ? false : true
			}
		}
	}
</script>

<style>
	@import url("./css/main.css");
	
	.login {
		position: absolute;
		width: 100%;
		height: 100%;
		top:0;
	}
	.main {
		position: relative;
		margin-top: 180rpx;
		padding:30rpx;
	}
	.cu-btn {
		font-size: 25rpx;
		margin-left:1.5vh;
		background: rgba(0, 0, 0, 0.7);
		color:#FFFFFF;
	}
	.sendSms {
		color: #333!important;
	}
	.agreement {
		padding: 1rpx 30rpx;
		align-items: baseline;
	}
	.wbutton {
		margin-top:50rpx;
	}
	.cuIcon-roundcheck {
		font-size: 32rpx;
	}
</style>
		