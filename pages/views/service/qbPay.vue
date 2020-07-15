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
		<!-- start 全国QB -->
		<view v-show="tabCur == 0">
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
				<input class="uni-input" placeholder="请输入充值账号" v-model="account" />
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
		<!-- end 全国QB -->
		<!-- start 地区QB -->
		<view v-show="tabCur == 1">
			<view class="cu-form-group flex justify-center">
				<view class='cu-tag light bg-grey'>你当前所在地区:{{city}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">购买数量</view>
				<view class="title flex buy-num">
					<text class="lg num text-gray cuIcon-move" @click="handNumH(-1)"></text>
					<input type="number" disabled class="text uni-input" v-model="numOther" placeholder="0" />
					<text class="lg num text-gray cuIcon-add" @click="handNumH(1)"></text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">充值账号</view>
				<input class="uni-input" placeholder="请输入充值账号" v-model="accountOther" />
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
		<!-- end 地区QB -->
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
				tabCur: 0,
				scrollLeft: 0,
				tab:['全国Q币','地区Q币'],
				num:1,
				numOther:1,
				areaId:-1,
				city:'未知',
				userInfo:[],
				chennal:'请选择渠道号',
				payOpen:false,
				midArr: [],
				midList:[],
				disList:[],
				disListOther:[],
				businessPay:false,
				errTxt:'',
				money:0,
				moneyOther:0,
				use:false,
				useOther:false,
				payType:0,
				discount:'',
				account:'',
				accountOther:''
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
			this.initDiscount()
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
				this.$http.get('/v1/check/recharge/status/qgqb').then(res => {
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
				this.$http.get('/v1/check/recharge/status/dqqb').then(res => {
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
			initDiscount() {
				this.$http.get("/v1/recharge/card/discount",{params:{pcid: 30}}).then(res => {
					if (res.data.code == 200) {
						this.disList = res.data.data.data
						this.playCheck(0)
						this.initExt()
					} else {
						uni.showToast({
							icon: 'none',
							position: 'center',
							title: '获取折扣失败,请重载页面'
						});
						this.use = false
						this.useOther = false
					}
				})
			},
			initExt() {
				this.$http.get("/v1/show/tencent/region/recharge").then(res => {
					if (res.data.code == 200) {
						this.disListOther = res.data.data.data.cardInfo.original.data.data.rechargeType
						this.city = res.data.data.data.location.city
						this.areaId = res.data.data.data.cardid
						this.playCheck(0)
					} else {
						uni.showToast({
							icon: 'none',
							position: 'center',
							title: '获取折扣失败,请重载页面'
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
			chennalChange(e) {
				this.chennal = e.detail.value
			},
			toPay() {
				if (this.tabCur == 0) {
					if (!this.use) {
						return
					}
					if (this.account == "") {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '充值账号不能为空'
						});
						return
					}
				} else {
					if (!this.useOther) {
						return
					}
					if (this.accountOther == "") {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '充值账号不能为空'
						});
						return
					}
				}
				this.payOpen = true
			},
			handNum(e) {
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
				if (this.tabCur == 0) {
					this.money = this.formatMoney(this.num * this.discount)
				} else {
					this.moneyOther = this.formatMoney(this.numOther * this.discount)
				}
			},
			searchOrder() {
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
				this.$http.post("/v1/qq/recharge", {
					pcid: this.tabCur == 0 ? "30" : this.areaId,
					payway: this.payType + 1,
					num: this.tabCur == 0 ? this.num : this.numOther,
					username: this.tabCur == 0 ? this.account : this.accountOther,
					paypwd: e
				}).then(res => {
					let msg = "充值金额：" + (this.tabCur == 0 ? this.money : this.moneyOther) + ",充值账号：" + (this.tabCur == 0 ? this.account : this.accountOther)
					let that = this
					let terOut = setInterval(() => {
						that.postMessageTxt(this.tabCur == 0 ? 'Q币充值' : '地区Q币充值(' + this.city + ')',msg)
						clearInterval(terOut)
					}, 1000)
					if (res.data.code == 200) {
						uni.$emit("payBack",true)
					} else if (res.code == 10020) {
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
