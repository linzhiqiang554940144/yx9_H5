<template>
	<view>
		<cu-header :isBack="true">
			<block slot="backText"></block>
			<block slot="content">骏卡充值</block>
		</cu-header>
		<view class="cu-form-group">
			<view class="title">充值面额</view>
			<view class="n-picker margin-right-sm" @click="openMid()">
				{{mid}}
				<text class="lg text-gray cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-form-group">
			<text class="title">库存</text>
			<text class="title">{{stock}}</text>
		</view>
		<view class="cu-form-group">
			<view class="title">购买数量</view>
			<view class="title flex buy-num">
				<text class="lg num text-gray cuIcon-move" @click="handNum(-1)"></text>
				<input type="number" disabled class="text uni-input" v-model="num" placeholder="0" />
				<text class="lg num text-gray cuIcon-add" @click="handNum(1)"></text>
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
		<view class="cu-bar bg-white tabbar border shop">
			<view class="money align-center justify-start flex margin-left">实付金额:<view class="amoney">{{money}}</view></view>
			<view class="bg-red submit" @click="toPay()">立即支付</view>
		</view>
		<view class="cu-modal bottom-modal" :class="midOpen?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white">
					<view class="action text-blue" @tap="hideModal">取消</view>
					<view class="action text-green" @tap="selectOpt">确定</view>
				</view>
				<view class="grid col-3 padding-sm">
					<view v-for="(item,index) in checkbox" class="padding-xs" :key="index">
						<button class="cu-btn lg block" :class="item.num == 0 ? '' : (item.checked?'orange bg-orange':'orange line-orange')" @tap="chooseCheckbox" 
						 :data-value="item.value"> {{item.name}}
						</button>
					</view>
				</view>
			</view>
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
				checkbox: [],
				userInfo:[],
				midArr: [],
				midList:[],
				disList:[],
				midCheck:{},
				businessPay:false,
				errTxt:'',
				type:1,
				money:0,
				use:false,
				payType:0,
				account:'',
				discount:'',
				stock:''
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
				this.$http.get('/v1/check/recharge/status/jkcz').then(res => {
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
			},
			initMidform(e) {
				this.$http.get("/v1/recharge/junka",{params:{pcid: 15}}).then(res => {
					if (res.data.code == 200) {
						this.midList = res.data.data.data.amount
						for (let i = 0; i < this.midList.length; i++) {
							let data = {
								value: i,
								id:this.midList[i].id,
								name: this.midList[i].point,
								num: this.midList[i].stock,
								checked: false
							}
							let cardArr = ["10","15","20","30","50","100","120","200","500","1000"]
							if (cardArr.indexOf(data.name) != -1) {
								data.num = '充足'
							}
							this.checkbox.push(data)
						}
						this.disList = res.data.data.data
						this.playCheck(0)
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
			playCheck(e) {
				this.payType = e
				if (e == 0) {
					this.discount = typeof(this.disList.starRate) != 'undefined' ? this.disList.starRate : this.disList.rate
				} else {
					this.discount = typeof(this.disList.starDisRate) != 'undefined' ? this.disList.starDisRate : this.disList.disRate
				}
				this.totalMoney()
			},
			openMid() {
				this.midOpen = true
			},
			hideModal() {
				this.midOpen = false
			},
			selectOpt() {
				let items = this.checkbox
				let isCheck = false
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].checked && items[i].num != 0) {
						this.stock = items[i].num
						this.midCheck = items[i]
						this.mid = items[i].name
						isCheck = true
						break
					}
				}
				if (isCheck) {
					this.totalMoney()
					this.hideModal()
				}
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
				if (typeof(this.midCheck.name) == "undefined") {
					uni.showToast({
					    icon: 'none',
						position: 'center',
					    title: '请选择面额'
					});
					return
				}
				this.payOpen = true
			},
			chooseCheckbox(e) {
				let items = this.checkbox
				let values = e.currentTarget.dataset.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].value == values) {
						items[i].checked = !items[i].checked
					}  else {
						items[i].checked = false
					}
				}
			},
			handNum(e) {
				if (e < 0 && this.num <= 1) {
					return
				}
				if (this.num + e >= this.stock) {
					return
				}
				this.num += e
				this.totalMoney()
			},
			totalMoney() {
				if (typeof(this.midCheck.name) != "undefined") {
					this.money = this.formatMoney(Number(this.midCheck.name) * this.num * this.discount)
				}
			},
			applyTo(e) {
				let postUrl = "/v1/recharge/junka"
				let data = {
					num: this.num,
					paypwd: e,
					payway: this.payType + 1,
					mid: this.midCheck.id
				}
				if (this.mid.num == '充足') {
					data.recharge = 2
				} else {
					postUrl = "/v1/recharge/JunKa/recharge"
				}
				this.$http.post(postUrl, data).then(res => {
					let msg = "充值面额:" + this.mid  + ",充值数量:" + this.num + ",充值金额：" + this.money + "."
					let that = this
					let terOut = setInterval(() => {
						that.postMessageTxt('骏卡充值',msg)
						clearInterval(terOut)
					}, 1000)
					if (res.data.code == 200) {
						uni.$emit("payBack",true)
					} else if (res.data.code == 35712) {
						this.$http.post("/v1/recharge/junka", {
							num: this.num,
							paypwd: e,
							payway: this.payType + 1,
							mid: this.midCheck.id,
							recharge:2
						}).then(rT => {
							if (rT.data.code == 200) {
								uni.$emit("payBack",true)
							} else {
								uni.$emit("payBack",false)
								this.errTxt = rT.data.message
							}
						})
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
		font-size: 30rpx;
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
