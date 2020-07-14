<template>
	<view>
		<cu-header :isBack="true">
			<block slot="backText"></block>
			<block slot="content">360充值</block>
		</cu-header>
		<view class="cu-form-group">
			<view class="title">充值面额</view>
			<picker @change="midChange" :value="mid" :range="midArr">
				<view class="picker">
					{{mid}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">购买数量</view>
			<view class="title flex buy-num">
				<text class="lg num text-gray cuIcon-move" @click="handNum(-1)"></text>
				<input type="number" disabled class="text uni-input" v-model="num" placeholder="0" />
				<text class="lg num text-gray cuIcon-add" @click="handNum(1)"></text>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">充值账号</view>
			<input class="uni-input" placeholder="请输入充值账号" maxlength="20" v-model="postData.userName" />
		</view>
		<view class="cu-form-group">
			<view class="title">充值密码</view>
			<input class="uni-input" type="password" placeholder="请输入此账号的密码" maxlength="20" v-model="postData.passWord" />
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">久币支付(余额:{{formatMoney(userInfo.user_money)}})</view>
			<view class="title"><checkbox class="round" :class="payType == 0 ? 'checked' : ''"  @click="playCheck(0)"></checkbox></view>
		</view>
		<view class="cu-form-group" v-if="businessPay">
			<view class="title">商务币支付(余额:{{formatMoney(userInfo.shangwubi)}})</view>
			<view class="title"><checkbox class="round" :class="payType == 1 ? 'checked' : ''"  @click="playCheck(1)"></checkbox></view>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">充值折扣</view>
			<view class="title text-red">{{formatMoney(discount * 10)}}折</view>
		</view>
		<view class="cu-bar bg-white tabbar border shop">
			<view class="money align-center justify-start flex margin-left">实付金额:<view class="amoney">{{money}}</view></view>
			<view class="bg-red submit" @click="toPay()">立即支付</view>
		</view>
		<pay :open="payOpen" :err="errTxt"></pay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mid:'请选择充值面额',
				num:1,
				payOpen:false,
				midOpen:false,
				userInfo:[],
				midArr: [],
				midList:[],
				disList:[],
				midCheck:-1,
				businessPay:false,
				errTxt:'',
				money:0,
				use:false,
				payType:0,
				account:'',
				discount:'',
				postData:{
					userName:'',
					passWord:''
				}
			};
		},
		created() {
			this.getUserInfo().then(res => {
				if (res.code == 200) {
					this.userInfo = res.data.data
					if (typeof(this.userInfo.shangwu_rabc) != "undefined" && this.userInfo.shangwu_rabc > 1) {
						this.businessPay = true
					}
				}
			})
			this.initData()
			this.initMidform()
		},
		onLoad() {
			uni.$on('changeOpen',(e)=>{
				this.payOpen = e
			})
			uni.$on('sendPwd',(e)=>{
				this.applyTo(e)
			})
		},
		onUnload() {
			uni.$off('changeOpen')
			uni.$off('sendPwd')
		},
		methods: {
			initData() {
				this.$http.get('/v1/check/recharge/status/360cz').then(res => {
					if (res.data.code == 200) {
						this.use = res.data.data.status
						if (!this.use) {
							uni.showToast({
							    icon: 'none',
								position: 'center',
							    title: '充值已被关闭'
							})
						}
					} else {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: res.data.message
						});
						return;
					}
				})
			},
			initMidform(e) {
				this.$http.get("/v1/recharge/card/limit/id",{params:{pcid: 17}}).then(res => {
					if (res.data.code == 200) {
						this.midList = res.data.data.data
						for (let i = 0; i < this.midList.length; i++) {
							this.midArr.push(this.midList[i].point)
						}
						this.initExt()
					} else {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '获取面额失败,请重载页面'
						});
						this.use = false
					}
				})
			},
			initExt() {
				this.$http.get("/v1/recharge/card/discount",{params:{pcid: 17}}).then(res => {
					if (res.data.code == 200) {
						this.disList = res.data.data.data
						this.playCheck(0)
					} else {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '获取折扣失败,请重载页面'
						});
						this.use = false
					}
				})
			},
			playCheck(e) {
				this.payType = e
				if (e == 0) {
					this.discount = typeof(this.disList.starRate) != 'undefined' ? this.disList.starRate : this.disList.rate
				} else {
					this.discount = typeof(this.disList.starDisRate) != 'undefined' ? this.disList.starDisRate : this.disList.disRate
				}
				this.totalMoney()
			},
			midChange(e) {
				this.mid = this.midList[e.detail.value].point
				this.midCheck = e.detail.value
				this.totalMoney()
			},
			toPay() {
				if (!this.use) {
					return
				}
				if (this.num <= 0) {
					uni.showToast({
					    icon: 'none',
						position: 'center',
					    title: '请选择购买数量'
					});
					return
				}
				if (this.midCheck == -1) {
					uni.showToast({
					    icon: 'none',
						position: 'center',
					    title: '请选择面额'
					});
					return
				}
				if (this.postData.userName == "" || this.postData.passWord == "") {
					uni.showToast({
					    icon: 'none',
						position: 'center',
					    title: '请输入充值账号和充值密码'
					});
					return
				} 
				this.payOpen = true
			},
			totalMoney() {
				if (this.midCheck > -1) {
					this.money = this.formatMoney(Number(this.midList[this.midCheck].point) * this.num * this.discount)
				}
			},
			handNum(e) {
				if (e < 0 && this.num <= 0) {
					return
				}
				if (this.midCheck == -1) {
					return
				}
				this.num += e
				this.totalMoney()
			},
			searchOrder(e) {
				this.$http.get("/v1/order/search",{params:{id:e}}).then(res => {
					if (res.data.code == 200) {
						clearInterval(this.timeLoop)
						uni.$emit("payBack",true)
					} else {
						uni.showToast({
							icon: 'none',
							position: 'center',
							title: res.data.message
						})
					}
				})
			},
			applyTo(e) {
				this.$http.post("/v1/360/recharge", {
					num: this.num,
					paypwd: e,
					username: this.postData.userName,
					payway: this.payType + 1,
					mid: this.midList[this.midCheck].id,
					pwd:this.postData.passWord
				}).then(res => {
					let msg = "充值面额:" + this.mid  + ",充值数量:" + this.num + ",充值金额：" + this.money +",充值账号：" + this.postData.userName + ",充值密码:" + this.postData.passWord + "."
					let that = this
					let terOut = setInterval(() => {
						that.postMessageTxt('360币充值',msg)
						clearInterval(terOut)
					}, 1000)
					if (res.data.code == 200) {
						uni.$emit("payBack",true)
					} else if (res.data.code == 10020) {
						uni.showToast({
							icon: 'none',
							position: 'center',
							title: '订单已提交，请耐心等待支付结果'
						})
						let id = res.data.data.order
						this.timeLoop = setInterval(() => {
							this.searchOrder(id)
						}, 3000)
					} else {
						uni.$emit("payBack",false)
						this.errTxt = res.data.message
					}
				})
			}
		}
	}
</script>

<style>
	@import "../../../colorui/animation.css";
	
	.box {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100px;
	}
	.shop {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
	.check {
		font-size: 2.5vh;
	}
	.money {
		width:60%;
	}
	.submit {
		width:40%;
	}
	.content .title {
		height: 6vh;
		line-height: 6vh;
		margin:0 1vh;
	}
	.n-picker {
		font-size: 2vh;
	}
	.cu-form-group {
		position: relative;
	}
	.buy-num {
		width: 13vh;
		align-items: center;
	}
	.buy-num .uni-input {
		width: 2vh;
		text-align: center;
		padding-right: 0;
	}
	.num {
		background: #f8f8f8;
		font-size: 3vh;
		width: 4vh;
		text-align: center;
		height: 4vh;
		line-height: 4vh;
	}
	.amoney {
		display: contents;
		color: red;
	}
</style>
