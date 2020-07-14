<template>
	<view class="login">
		<view class="content">
			<view class="title">
				<!-- 头部logo -->
				<view class="logo">
				</view>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<view class="cu-form-group">
					<input class="uni-input" type="number" maxlength="11" v-model="phoneData" placeholder="请输入手机号" />
				</view>
				<view class="cu-form-group">
					<input class="uni-input" type="number" maxlength="6" v-model="smsCode" placeholder="请输入验证码" />
					<button class='cu-btn bg-blue shadow' :disabled="isSend ? true : false" :class="isSend ? 'sendSms' : ''" @click="sendCode">{{codeTxt}}</button>
				</view>
			</view>
			<wButton 
				text="登 录"
				:rotate="isRotate" 
				@click.native="startLogin()"
				class="wbutton"
			></wButton>
			
			<!-- 其他登录 -->
			<!-- <view class="other_login cuIcon">
				<view class="login_icon">
					<view class="cuIcon-weixin" @tap="login_weixin"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-weibo" @tap="login_weibo"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-github" @tap="login_github"></view>
				</view>
			</view> -->
			
			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="register" open-type="navigate">注册账号</navigator>
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
				isSend:false
			};
		},
		components:{
			wInput,
			wButton,
		},
		mounted() {
			this.isLogin();
		},
		onShow(){
		},
		methods: {
			isLogin(){
				try {
					let value = uni.getStorageSync('token')
					if (value) {
						this.checkUser()
					}
				} catch (e) {
					console.log(e)
				}
			},
		    startLogin() {
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
				this.isRotate=true
				let that = this
				setTimeout(function(){
					that.$http.post(process.env.USER_API + '/v1/user/login',{tel: that.phoneData,code:that.smsCode }).then(res => {
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
						uni.setStorageSync('token', res.data.data.data)
						//todo Check userInfo
						that.checkUser()
					})
					.catch(err => {
						console.log(err)
					})
				},500)
		    },
			checkUser() {
				this.$http.get(process.env.USER_API + '/v1/personal/user/info').then(res => {
					if (res.data.code != 200) {
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: res.data.message
						});
						return;
					}
				    if (res.data.data.data.status == 0) {
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: '请先认证'
						});
				        setTimeout(() => {
				          uni.redirectTo({
				              url: '/pages/views/auth/auth'
				          });
				        }, 1000);
				    } else if (res.data.data.data.status == 1 && res.data.data.data.shangwu_rabc == 1 ) {
				        uni.showToast({
				            icon: 'none',
				         	position: 'bottom',
				            title: '请先认证'
				        });
				        setTimeout(() => {
				          uni.redirectTo({
				              url: '/pages/views/auth/auth'
				          });
				        }, 1000);
				    }
				    else if (res.data.data.data.status==1 && res.data.data.data.shangwu_rabc !=1 ) {
				       uni.showToast({
				           icon: 'none',
				        	position: 'bottom',
				           title: '手机端不支持企业认证，请移步到电脑端'
				       });
					   return
				    } else if(res.data.data.data.status == 2 || res.data.data.data.status == 9 ) {
				        if (res.data.data.data.shangwu_rabc == 1 && res.data.data.data.auth_face == 0) {
								setTimeout(() => {
								  uni.redirectTo({
									  url: '/pages/views/auth/person'
								  });
								}, 1000);
								//localStorage.setItem("authentication", '1');
								return;
				        } else {
							this.$http.post('/message',{name: "登陆",data:this.phoneData }).then(res => {})
							uni.reLaunch({
								url:'../index/index'
							})
						}
				    } else if(res.data.data.data.status == 3) {
					  uni.showToast({
					      icon: 'none',
					   	position: 'bottom',
					      title: '认证失败请联系管理员'
					  });
					  return
				    }
				    else if (res.data.data.data.status==4) {
						uni.showToast({
						    icon: 'none',
						 	position: 'bottom',
						    title: '您已被拉黑,请联系管理员'
						});
						return
				    }
				    else if (res.data.data.data.status==7) {
						uni.showToast({
						    icon: 'none',
						 	position: 'bottom',
						    title: '商务审核中,请到PC端操作'
						});
						return
				    }
				    else if (res.data.data.data.status==-1) {
					   uni.showToast({
					       icon: 'none',
					    	position: 'bottom',
					       title: '账号异常,请联系管理员'
					   });
					   return
				    }
				  });
			},
			sendCode() {
				this.$http.get("/v1/tel/code", {params:{
				  tel: this.phoneData,
				  type: "3"
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
			}
		}
	}
</script>

<style>
	@import url("./css/main.css");
	
	.login {
		background-image: url(../../../static/bg.jpg);
		height: 100vh;
	}
	.logo {
		background-image: url(../../../static/logo.png);
		width: 21vh;
		height: 7vh;
		margin: 13vh auto;
		background-repeat: space;
		background-size: 100%;	
	}
	.title {
		height: 30vh;
	}
	.main {
		position: relative;
		margin-top: 2vh;
	}
	.cu-form-group {
		margin-top: 0.1vh;
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
</style>
