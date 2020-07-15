<template>
	<view>
		<cu-header :isBack="true">
			<block slot="content">新浪微博会员</block>
		</cu-header>
		<view class="cu-form-group">
			<view class="title text-bold">开通时长</view>
		</view>
		<view class="cu-form-group" @click="selectOne(index)" v-for="(val,index) in cardList" :key="index" >
			<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>{{val}}</view>
			<view class="title"><checkbox v-show="thisCheck == index"  class="round checked" checked="true"></checkbox></view>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">充值账号</view>
			<input class="uni-input" v-model="account" placeholder="请输入充值账号" />
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
				mid:'100',
				num:0,
				payOpen:false,
				cardList:['月卡','季卡','半年卡','年卡'],
				thisCheck:0,
				midList:[],
				use:true,
				discount:'',
				userInfo:[],
				payType:0,
				money:0,
				account:'',
				businessPay:false,
				disList:[],
				moneyForm:{
					'166':15,
					'167':45,
					'168':90,
					'169':180
				},
				errTxt:'',
				
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
			toPay() {
				if (!this.use) {
					uni.showToast({
					    icon: 'none',
						position: 'center',
					    title: '充值已被关闭'
					})
					return
				}
				
				if (this.account == "") {
					uni.showToast({
					    icon: 'none',
						position: 'center',
					    title: '请输入充值账号'
					});
					return
				} 
				this.payOpen = true
			},
			initData() {
				this.$http.get('/v1/check/recharge/status/xlwbhy').then(res => {
					if (res.data.code == 200) {
						if(res.data.data.status == 2){
							this.use = false
							if (!this.use) {
								uni.showToast({
								    icon: 'none',
									position: 'center',
								    title: '充值已被关闭'
								})
							}
						}
						
						this.initMidform()
						
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
				this.$http.get("/v1/recharge/card/limit/id",{params:{pcid: 78}}).then(res => {
					if (res.data.code == 200) {
						this.midList = res.data.data.data
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
				this.$http.get("/v1/recharge/card/discount",{params:{pcid: 78}}).then(res => {
					if (res.data.code == 200) {
						for (let i = 0; i < res.data.data.data.length; i++) {
							for (let j = 0; j < this.midList.length; j++) {
								if(this.midList[j].point == res.data.data.data[i].point){
									this.midList[j].disRate = res.data.data.data[i].disRate
									this.midList[j].rate = res.data.data.data[i].rate
								}
							}
							
						}
						this.getdiscount()
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
			midChange(e) {
				this.mid = this.midList[e.detail.value].point
				this.midCheck = e.detail.value
				this.initExt()
			},
			playCheck(e) {
				this.payType = e
				this.getdiscount()
			},
			totalMoney() {
				this.money = this.moneyForm[this.midList[this.thisCheck].id] * this.discount
			},
			selectOne(e) {
				this.thisCheck = e
				this.getdiscount()
			},
			getdiscount(){
				this.discount = this.payType == 0?this.midList[this.thisCheck].rate:this.midList[this.thisCheck].disRate
				this.totalMoney()
			},
			applyTo(e) {
				this.$http.post("/v1/sinaweino/recharge", {
					pcid:78,
					num:1,
					paypwd: e,
					username: this.account,
					payway: this.payType + 1,
					mid: this.midList[this.thisCheck].id
				}).then(res => {
					let msg = "充值面额:" + this.midList[this.thisCheck].point  + ",充值金额：" + this.money +",充值账号：" + this.account+ "."
					let that = this
					let terOut = setInterval(() => {
						that.postMessageTxt('新浪会员充值',msg)
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
</style>
