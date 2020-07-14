<template>
	<view>
		<cu-header :isBack="true"><block slot="backText">返回</block><block slot="content">渠道加币</block></cu-header>
		<view class="cu-form-group">
			<view class="title">游戏平台</view>
			<picker @change="platformChange" :value="platform.platform" :range="platformArr">
				<view class="picker">
					{{platform.platform}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">渠道号</view>
			<picker @change="channelChange" :value="channel.title" :range="channelArr">
				<view class="picker">
					{{channel.title}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">充值金额</view>
			<input class="uni-input" type="number" placeholder="请输入充值金额" v-model="money" @change="handMoney()" />
		</view>
		<view class="cu-form-group margin-top" v-if="lebaOpen">
			<view class="title">乐豆</view>
			<view class="title"><checkbox class="round" :class="leType == 0 ? 'checked' : ''"  @click="leCheck(0)"></checkbox></view>
		</view>
		<view class="cu-form-group" v-if="lebaOpen">
			<view class="title">乐币</view>
			<view class="title"><checkbox class="round" :class="leType == 1 ? 'checked' : ''"  @click="leCheck(1)"></checkbox></view>
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
			<view class="title text-red">{{formatMoney(discount)}}折</view>
		</view>
		<view class="cu-bar bg-white tabbar border shop">
			<view class="money align-center justify-start flex margin-left">实付金额:<view class="amoney">{{formatMoney(aMoney)}}</view></view>
			<view class="bg-red submit" @click="toPay()">立即支付</view>
		</view>
		<pay :open="payOpen" :err="errTxt"></pay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},
				platform:{platform:'请选择游戏平台'},
				channel:{title:'请选择渠道号'},
				payOpen:false,
				use:1,
				platformArr:[],
				resultP:[],
				channelArr:[],
				resultC:[],
				leType:0,
				payType:0,
				businessPay:false,
				lebaOpen:false,
				discount:'',
				aMoney:0,
				money:'',
				leArr:[],
				errTxt:''
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
			this.initPlatform()
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
			playCheck(e) {
				this.payType = e
				if (this.platform.platform == '请选择游戏平台') {
					return
				}
				//乐币特殊处理
				let data = this.platform
				if (this.leType == 1) {
					data = this.leArr
				}
				if (e == 0) {
					this.discount = data.userDisRate ? data.userDisRate : data.disRate
				} else {
					this.discount = data.userRate ? data.userRate : data.rate
				}
				this.handMoney()
			},
			leCheck(e) {
				//乐币为乐8券
				if (e == 1) {
					if (this.leArr.length == 0) {
						uni.showToast({
							icon: 'none',
							position: 'center',
							title: '乐币未开放'
						})
						return
					}
				}
				this.leType = e
				this.playCheck(this.payType)
			},
			initData() {
				this.$http.get('/v1/check/recharge/status/qdcz').then(res => {
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
			initPlatform() {
				this.$http.get('/v1/recharge/channel/platform').then(res => {
					if (res.data.code == 200) {
						this.resultP = res.data.data.data
						for (let i = 0; i < this.resultP.length; i++) { 
							this.platformArr.push(this.resultP[i].platform)
							if (this.resultP[i].pid == "e37395fdab418rtgfrhgthretgewrger") {
								this.leArr = this.resultP[i]
							}
						}
					}
				})
			},
			getChannelList(e) {
				this.$http.get('/v1/recharge/channel/platform/' + e).then(res => {
					if (res.data.code == 200) {
						this.resultC = res.data.data.data
						this.channelArr = []
						for (let i = 0; i < this.resultC.length; i++) { 
							this.channelArr.push(this.resultC[i].title)
						}
						if (this.channelArr.length == 0) {
							this.channelArr.push("暂无数据")
							this.channel.title = "暂无数据"
						} else {
							this.channel = this.resultC[0]
						}
					}
				})
			},
			platformChange(e) {
				this.platform = this.resultP[e.detail.value]
				this.discount = this.platform.userDisRate ? this.platform.userDisRate : this.platform.disRate
				this.handMoney()
				this.getChannelList(this.platform.pid)
				if (this.platform.pid == 'e37395fdab41836fbadc68ad865d5825') {
					this.lebaOpen = true
				} else {
					this.lebaOpen = false
				}
			},
			handMoney() {
				this.aMoney = (this.money / 10) * this.discount
				if (isNaN(this.aMoney)) {
					this.aMoney = 0
				}
			},
			channelChange(e) {
				if (this.resultC.length > 0) {
					this.channel = this.resultC[e.detail.value]
				}
			},
			toPay() {
				if (this.use) {
					if (typeof(this.platform.pid) == "undefined" || this.platform.pid == "") {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '请先选择游戏平台'
						});
						return
					}
					if (typeof(this.channel.cid) == "undefined" || this.channel.cid == "") {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '请先选择渠道号'
						});
						return
					}
					if (this.channel.title == '暂无数据') {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '您还没有申请渠道号'
						});
						return
					}
					if (this.money == "") {
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: '金额不能为空'
						});
						return
					}
					this.errTxt = ""
					this.payOpen = true
				}
			},
			applyTo(e) {
				//pid cid paypwd payway money coin_type
				let params = {
					pid:this.platform.pid,
					cid:this.channel.cid,
					paypwd:e,
					payway:this.payType+1,
					money:this.money
				}
				if (this.platform.pid == 'e37395fdab41836fbadc68ad865d5825') {
					params.coin_type = this.leType+1
				}
				this.$http.post('/v1/recharge/channel',params).then(res => {
					if (res.data.code == 200) {
						uni.$emit("payBack",true)
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
	.amoney {
		display: contents;
		color: red;
	}
	.submit {
		width:40%;
	}
	.content .title {
		height: 6vh;
		line-height: 6vh;
		margin:0 1vh;
	}
	.uni-checkbox .uni-checkbox-input {
		width:0.5vh;
	}
</style>
