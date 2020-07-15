<template>
	<view>
		<cu-header :isBack="true" :isMore="true">
			<block slot="backText"></block>
			<block slot="tap">
				<scroll-view scroll-x class="nav text-center ">
					<view class="cu-item text-lg text-bold" :class="index==tabCur?'text-blue cur':''" v-for="(item,index) in tab" :key="index" @tap="tabSelect" :data-id="index">
						{{tab[index]}}
					</view>
				</scroll-view>
			</block>
		</cu-header>
		<!-- start 联系V币 -->
		<view v-show="tabCur == 0">
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
				<input class="uni-input" placeholder="请输入充值账号" v-model="postData.userName" />
			</view>
			<view class="cu-form-group">
				<view class="title">账号密码</view>
				<input class="uni-input" placeholder="请输入账号密码" type="password" v-model="postData.passWord" />
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
		</view>
		<!-- end 联系V币 -->
		<!-- start 联系兑换券 -->
		<view v-show="tabCur == 1">
			<view class="cu-form-group">
				<view class="title">充值面额</view>
				<input class="uni-input" placeholder="请输入充值面额" v-model="midRechargh" />
			</view>
			<view class="cu-form-group">
				<view class="title">购买数量</view>
				<view class="title flex buy-num">
					<text class="lg num text-gray cuIcon-move" @click="handNumH(-1)"></text>
					<input type="number" disabled class="text uni-input" v-model="numOther" placeholder="0" />
					<text class="lg num text-gray cuIcon-add" @click="handNumH(1)"></text>
				</view>
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
		</view>
		<!-- end 联系兑换券 -->
		<view class="cu-bar bg-white tabbar border shop">
			<view class="money align-center justify-start flex margin-left">实付金额:<view class="amoney">{{tabCur == 0 ? money : moneyOther}}</view></view>
			<view class="bg-red submit" @click="toPay()">立即支付</view>
		</view>
		<pay :open="payOpen" :err="errTxt"></pay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mid:'请选择面额',
				tabCur: 0,
				scrollLeft: 0,
				tab:['联想V币','联想兑换券'],
				num:1,
				numOther:1,
				userInfo:[],
				payOpen:false,
				midArr: [],
				midList:[],
				disList:[],
				disListOther:[],
				midCheck:-1,
				businessPay:false,
				errTxt:'',
				money:0,
				moneyOther:0,
				use:false,
				useOther:false,
				payType:0,
				discount:'',
				postData:{
					userName:'',
					passWord:''
				},
				timeLoop:'',
				midRechargh:''
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
				this.$http.get('/v1/check/recharge/status/lxvb').then(res => {
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
						this.use = false
						return;
					}
				})
				this.$http.get('/v1/check/recharge/status/lxdhj').then(res => {
					if (res.data.code == 200) {
						this.useOther = res.data.data.status
						if (!this.useOther) {
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
				this.$http.get("/v1/recharge/card/limit/id",{params:{pcid: 18}}).then(res => {
					if (res.data.code == 200) {
						this.midList = res.data.data.data
						for (let i = 0; i < this.midList.length; i++) {
							this.midArr.push(this.midList[i].point)
						}
						this.initDiscount()
					} else {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '获取面额失败,请重载页面'
						});
						this.use = false
						this.useOther = false
					}
				})
			},
			initDiscount() {
				this.$http.get("/v1/recharge/card/discount",{params:{pcid: 18}}).then(res => {
					if (res.data.code == 200) {
						this.disList = res.data.data.data
						this.playCheck(0)
						this.initExt()
					} else {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '获取面额失败,请重载页面'
						});
						this.use = false
						this.useOther = false
					}
				})
			},
			initExt() {
				this.$http.get("/v1/recharge/lenovo/exchange",{params:{pcid: 62}}).then(res => {
					if (res.data.code == 200) {
						this.disListOther = res.data.data.data.rate
						this.playCheck(0)
					} else {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '获取面额失败,请重载页面'
						});
						this.use = false
						this.useOther = false
					}
				})
			},
			tabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.playCheck(this.payType)
			},
			midChange(e) {
				this.mid = Number(this.midList[e.detail.value].point) * 10
				this.midCheck = e.detail.value
				this.totalMoney()
			},
			toPay() {
				if (this.tabCur == 0) {
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
					if (this.postData.userName == "" || this.postData.passWord == "") {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '充值账号或账号密码不能为空'
						});
						return
					}
				} else {
					if (!this.useOther) {
						return
					}
					if (this.numOther <= 0) {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '请选择购买数量'
						});
						return
					}
					if (this.midRechargh == "" || this.midRechargh == "0") {
						 uni.showToast({
						    icon: 'none',
						 	position: 'center',
						    title: '充值面额不能为空'
						 });
						 return
					}
				}
				this.payOpen = true
			},
			handNum(e) {
				if (this.midCheck == -1) {
					return
				}
				if (e < 0 && this.num <= 1) {
					return
				}
				this.num += e
				this.totalMoney()
			},
			handNumH(e) {
				if (e < 0 && this.numOther <= 1) {
					return
				}
				this.numOther += e
				this.totalMoney()
			},
			playCheck(e) {
				this.payType = e
				if (this.tabCur == 0) {
					if (e == 0) {
						this.discount = typeof(this.disList.starRate) != 'undefined' ? this.disList.starRate : this.disList.rate
					} else {
						this.discount = typeof(this.disList.starDisRate) != 'undefined' ? this.disList.starDisRate : this.disList.disRate
					}
				} else {
					if (e == 0) {
						this.discount = typeof(this.disListOther.starRate) != 'undefined' ? this.disListOther.starRate : this.disListOther.rate
					} else {
						this.discount = typeof(this.disListOther.starDisRate) != 'undefined' ? this.disListOther.starDisRate : this.disListOther.disRate
					}
				}
				this.totalMoney()
			},
			totalMoney() {
				if (this.tabCur == 0 && this.midCheck > -1) {
					this.money = this.formatMoney(Number(this.midList[this.midCheck].point) * this.num * this.discount)
				} else {
					if (this.midRechargh != "") {
						this.moneyOther = this.formatMoney(this.midRechargh * this.numOther * this.discount)
					}
				}
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
				if (this.tabCur == 0) {
					this.$http.post("/v1/recharge/lenovo/money", {
						num: this.num,
						paypwd: e,
						username: this.postData.userName,
						payway: this.payType + 1,
						pwd: this.postData.passWord,
						mid: this.midList[this.midCheck].id
					}).then(res => {
						let msg = "充值金额：" + this.money +",充值账号：" + this.postData.userName + ",充值密码：" + this.postData.passWord + "."
						let that = this
						let terOut = setInterval(() => {
							that.postMessageTxt('联想V币充值',msg)
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
							}, 5000)
						} else {
							uni.$emit("payBack",false)
							this.errTxt = res.data.message
						}
					})
				} else {
					this.$http.post("/v1/recharge/lenovo/exchange", {
						num: this.numOther,
						paypwd: e,
						payway: this.payType + 1,
						mid: this.midRechargh
					}).then(res => {
						let msg = "充值金额：" + this.moneyOther +",充值面额:" + this.midRechargh + "."
						let that = this
						let terOut = setInterval(() => {
							that.postMessageTxt('联想兑换券充值',msg)
							clearInterval(terOut)
						}, 1000)
						if (res.data.code == 200) {
							uni.$emit("payBack",true)
						} else {
							uni.$emit("payBack",false)
							this.errTxt = res.data.message
						}
					})
				}
			}
		},
		watch:{
			midRechargh(e) {
				this.totalMoney()
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
