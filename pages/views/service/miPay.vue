<template>
	<view>
		<cu-header :isBack="true" :isMore="true">
			<block slot="backText"></block>
			<block slot="tap">
				<scroll-view scroll-x class="nav text-center">
					<view class="cu-item text-lg text-bold" :class="index==tabCur?'text-blue cur':''" v-for="(item,index) in tab" :key="index" @tap="tabSelect" :data-id="index">
						{{tab[index]}}
					</view>
				</scroll-view>
			</block>
		</cu-header>
		<!-- <view class="pop">
			<text class="bg-green text-white padding-sm">归属查询</text>
			
		</view> -->
		<!-- start 自动充值 -->
		<view v-show="tabCur == 0">
			<view class="cu-form-group">
				<view class="title">充值面额(多选)</view>
				<view class="n-picker margin-right-sm" @click="openMid()">
					{{midTxt}}
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">充值账号</view>
				<input class="uni-input" placeholder="请输入充值账号" v-model="userName" />
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
				<view class="text-red">{{formatMoney(discount * 10)}}折</view>
			</view>
			
			<view v-for="(item,index) in checkCardList" class="cu-form-group" :key="index">
				<view class="title">{{item.name}} x {{item.buyNum}}</view>
				<view class="title">{{formatMoney(Number(item.name) * item.buyNum * discount)}}</view>
				<view :class="item.status != '成功' ? 'text-red' : ''" @click="lookCard(index)">{{item.status}}</view>
			</view>
			
		</view>
		<!-- end 自动充值 -->
		<!-- start 卡号卡密 -->
		<view v-show="tabCur == 1">
			<view class="cu-form-group">
				<view class="title">充值面额</view>
				<picker @change="midChange" :value="tMid" :range="midArr">
					<view class="picker">
						{{tMid}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">库存</view>
				<view class="title text-red">{{stock}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">购买数量</view>
				<view class="title flex buy-num">
					<text class="lg num text-gray cuIcon-move" @click="handNumN(-1)"></text>
					<input type="number" disabled class="text uni-input" v-model="num" placeholder="0" />
					<text class="lg num text-gray cuIcon-add" @click="handNumN(1)"></text>
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
		<!-- end 卡号卡密 -->
		<view class="cu-bar bg-white tabbar border shop">
			<view class="money align-center justify-start flex margin-left">实付金额:<view class="amoney">{{tabCur == 0 ? money : moneyOther}}</view></view>
			<view class="bg-red submit" @click="toPay()">立即支付</view>
		</view>
		<view class="cu-modal bottom-modal" :class="midOpen?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white">
					<view class="action text-blue" @tap="hideModal">取消</view>
					<view class="action text-green" @tap="selectOver">确定</view>
				</view>
				<view class="grid col-3 padding-sm">
					<view v-for="(item,index) in checkbox" class="padding-xs" :key="index">
						<button v-if="item.num > 0" class="cu-btn orange lg block" :class="item.checked?'bg-orange':'line-orange'" @click="chooseCheckbox" :data-value="item.value"> {{item.name}}</button>
						<button v-if="item.num == 0" class="cu-btn lg block"> {{item.name}}</button>
					</view>
				</view>
				<view class="grid col-1 padding-sm">
					<text>已选</text>
					<view v-for="(item,index) in checkCardList" class="padding-xs flex justify-between" :key="index">
						<button class="cu-btn orange lg block" :class="item.checked?'bg-orange':'line-orange'" :data-value="item.value"> {{item.name}}</button>
						<view class="flex on-right align-center justify-between">
							<view class="title flex buy-num">
								<text class="lg num text-gray cuIcon-move" @click="handNum(item,-1,item.num)"></text>
								<input type="number" disabled class="text uni-input" :value="item.buyNum" />
								<text class="lg num text-gray cuIcon-add" @click="handNum(item,1,item.num)"></text>
							</view>
							<text>库存:{{item.num}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<pay :open="payOpen" :err="errTxt"></pay>
		<view class="cu-modal" :class="viewOpen ? 'show' : ''">
			<view class="cu-dialog">
				<view class="margin-sm">
					<view class="cu-form-group" v-for="val in thisCard">
						<view class="text-left">
							<view><text>卡号:</text><text>{{val.cardNum}}</text></view>
							<view><text>卡密:</text><text>{{val.pwd}}</text></view>
						</view>
						<view class="text-blue" @click="copy(val)">复制</view>
					</view>
				</view>
				<view class="cu-bar bg-white justify-between">
					<view class="action text-blue flex-sub" @click="hideView">取消</view>
					<view class="action text-blue flex-sub" @click="copyAll()">一键复制</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				midTxt:'请选择面额',
				mid:{},
				tabCur: 0,
				scrollLeft: 0,
				tab:['自动充值','卡号卡密'],
				midTab:'请选择渠道号',
				payOpen:false,
				midOpen:false,
				use:false,
				useOther:false,
				num:0,
				userInfo:{},
				businessPay:false,
				cardList:[],
				checkCardList:[],
				checkbox: [],
				payType:0,
				discount:'',
				money:0,
				moneyOther:0,
				errTxt:'',
				userName:'',
				tMid:'请选择面额',
				midArr:[],
				stock:0,
				midCheck:-1,
				showCard:[],
				thisCard:{},
				viewOpen:false
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
			this.initMid()
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
				this.$http.get('/v1/check/recharge/status/mbzdcz').then(res => {
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
				this.$http.get('/v1/check/recharge/status/mbhqkhkm').then(res => {
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
			initMid() {
				this.$http.get("/v1/show/xiaomi/recharge").then(res => {
				    if (res.data.code == 200) {
						this.cardList = res.data.data.data
						if (this.cardList.cardMid.length == 0) {
							uni.showToast({
							    icon: 'none',
								position: 'center',
							    title: '获取面额失败,请重载页面'
							});
							this.use = false
							this.useOther = false
							return
						}
						this.checkbox = []
						for (let i = 0; i < this.cardList.cardMid.length; i++) {
							let data = {
								value: i,
								id:this.cardList.cardMid[i].id,
								name: this.cardList.cardMid[i].point,
								num: this.cardList.cardMid[i].stock,
								checked: false,
								status:'未充值',
								buyNum:0
							}
							this.midArr.push(this.cardList.cardMid[i].point)
							this.checkbox.push(data)
						}
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
			},
			midChange(e) {
				this.tMid = this.cardList.cardMid[e.detail.value].point
				this.getStock(this.cardList.cardMid[e.detail.value].id)
				this.midCheck = e.detail.value
			},
			getStock(e) {
				this.$http.get("/v1/recharge/point",{params:{mid:e}}).then(res => {
					if (res.data.code == 200) {
						this.stock = res.data.data.data
						if (this.stock > 0) {
							this.num = 1
						} else {
							this.num = 0
						}
						this.moneyOther = this.formatMoney(Number(this.cardList.cardMid[this.midCheck].point) * this.num * this.discount)
					}
				})
			},
			openMid() {
				this.midOpen = true
			},
			hideModal() {
				this.midOpen = false
			},
			toPay() {
				if ((this.use && this.tabCur == 0) || (this.useOther && this.tabCur == 1)) {
					if (this.tabCur == 0 && this.userName ==  "") {
						uni.showToast({
							icon: 'none',
							position: 'center',
							title: '请填写充值账号'
						});
						return
					}
					if (this.tabCur == 1 && this.num <= 0) {
						uni.showToast({
							icon: 'none',
							position: 'center',
							title: '请选择购买数量'
						});
						return
					}
					this.errTxt = ""
					this.payOpen = true
				}
			},
			selectOver() {
				this.hideModal()
				if (this.checkCardList.length == 0) {
					this.midTxt = "请选择面额"
					return
				}
				this.midTxt = ""
				for (let i = 0; i < this.checkCardList.length; ++i) {
					this.midTxt += this.checkCardList[i].name + ((i + 1 != this.checkCardList.length) ? "," : "")
				}
				this.totalMoney()
			},
			totalMoney() {
				this.money = 0
				for (let i = 0; i < this.checkCardList.length; ++i) {
					this.money += this.formatMoney(Number(this.checkCardList[i].name) * this.checkCardList[i].buyNum * this.discount)
				}
			},
			chooseCheckbox(e) {
				let items = this.checkbox
				let values = e.currentTarget.dataset.value
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].value == values) {
						items[i].checked = !items[i].checked
						break
					}
				}
				this.checkCardList = []
				for (let i = 0; i < this.checkbox.length; ++i) {
					if (this.checkbox[i].checked) {
						if (this.checkbox[i].buyNum == 0) {
							this.checkbox[i].buyNum = 1
						}
						this.checkCardList.push(this.checkbox[i])
					}
				}
			},
			handNum(item,e,max) {
				if (e < 0 && item.buyNum <= 1) {
					return
				}
				if (item.buyNum + e > max) {
					return
				}
				item.buyNum += e
			},
			handNumN(e) {
				if (e < 0 && this.num <= 1) {
					return
				}
				if (this.num + e > this.stock) {
					return
				}
				this.num += e
				this.moneyOther = this.formatMoney(Number(this.cardList.cardMid[this.midCheck].point) * this.num * this.discount)
			},
			playCheck(e) {
				this.payType = e
				if (e == 0) {
					this.discount = typeof(this.cardList.payDis.starRate) != 'undefined' ? this.cardList.payDis.starRate : this.cardList.payDis.rate
				} else {
					this.discount = typeof(this.cardList.payDis.starDisRate) != 'undefined' ? this.cardList.payDis.starDisRate : this.cardList.payDis.disRate
				}
				this.totalMoney()
			},
			lookCard(e) {
				if (typeof(this.showCard[e]) != "undefined") {
					this.thisCard = this.showCard[e]
					this.viewOpen = true
				}
			},
			copy(e) {
				uni.setClipboardData({
				    data: '卡号:' + e.cardNum  + ' 卡密:' + e.pwd + '\r\n',
				    success: function () {
				    }
				})
			},
			copyAll() {
				let data = ""
				for (let i = 0; i < this.thisCard.length; ++i) {
					 data += '卡号:' + this.thisCard[i].cardNum  + ' 卡密:' + this.thisCard[i].pwd + '\r\n'
				}
				uni.setClipboardData({
				    data: data,
				    success: function () {
				    }
				})
			},
			hideView() {
				this.thisCard = []
				this.viewOpen = false
			},
			applyTo(e) {
				this.failCard = []
				if (this.tabCur == 0) {
					this.checkCardList.forEach((item, index) => {
					    setTimeout(() => {
							this.$http.post("/v1/xiaomi/recharge", {
								num: this.checkCardList[index].buyNum,
								mid: item.id,
								paypwd: e,
								payway: this.payType+1,
								recharge: "2",
								username: index == 0 ? '1' : this.userName
							}).then(res => {
								if (res.data.code ==  200) {
									this.checkCardList[index].status = '充值成功'
								} else {
									this.checkCardList[index].status = res.data.message
									this.showCard[index] = res.data.data
								}								
								if (index  == this.checkCardList.length - 1) {
									uni.$emit("payBack",true)
								}
							})
					  }, index * 2500);
					})
				} else {
					this.$http.post("/v1/xiaomi/recharge", {
						num: this.num,
						mid: this.cardList.cardMid[this.midCheck].id,
						paypwd: e,
						payway: this.payType+1,
						recharge: "1"
					}).then(res => {
						if (res.data.code ==  200) {
							uni.$emit("payBack",true)
							this.showCard[0] = res.data.data
							let that = this
							setTimeout(function () {
								that.lookCard(0)
							}, 2000)
						} else {
							uni.$emit("payBack",false)
							this.errTxt = res.data.message
						}
					})
				}
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
		height: 60rpx;
		line-height: 60rpx;
		margin:0 10rpx;
	}
	.n-picker {
		font-size: 30rpx;
	}
	.cu-form-group {
		position: relative;
	}
	.on-right {
		width: 300rpx;
	}
	.buy-num {
		width: 180rpx;
		align-items: center;
	}
	.buy-num .uni-input {
		width: 50rpx;
		text-align: center;
		padding-right: 0;
	}
	.num {
		background: #f8f8f8;
		font-size: 50rpx;
		width: 50rpx;
		text-align: center;
		height: 50rpx;
		line-height: 50rpx;
	}
	.amoney {
		display: contents;
		color: red;
	}
	.pop {
		position: absolute;
		top:85%;
		left: 0;
		z-index: 999;
	}
</style>
