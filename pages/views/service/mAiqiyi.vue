<template>
	<view>
		<cu-header :isBack="true" :isMore="true">
			<block slot="backText"></block>
			<block slot="tap">
				<scroll-view scroll-x class="nav text-center ">
					<view class="cu-item text-lg text-bold" :class="index==pcid?'text-blue cur':''" v-for="(item,index) in tab" :key="index" @tap="tabSelect" :data-id="index">
						{{item}}
					</view>
				</scroll-view>
			</block>
		</cu-header>
		<!-- start 黄金会员 -->
		<view>
			<view class="cu-form-group">
				<view class="title text-bold">开通时长</view>
			</view>
			<view class="cu-form-group" v-for="(item,key) in cardList" :key="item.id">
				<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>{{item.point}}</view>
				<view class="title"><checkbox class="round" :class="cardId==item.id?'checked':''" @click="checkCard(key,item.id)"></checkbox></view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">充值账号</view>
				<input class="uni-input" placeholder="请输入充值账号" v-model="account"/>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">久币支付(余额:{{formatMoney(userInfo.user_money)}})</view>
				<view class="title"><checkbox class="round" :class="payType == 1 ? 'checked':''" @click="checkPayType(1)"></checkbox></view>
			</view>
			<view class="cu-form-group" v-if="businessPay">
				<view class="title">商务币支付(余额:{{formatMoney(userInfo.shangwubi)}})</view>
				<view class="title"><checkbox class="round" :class="payType == 2 ? 'checked':''" @click="checkPayType(2)"></checkbox></view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">充值折扣</view>
				<view class="title text-red">{{formatMoney(discount)}}折</view>
			</view>
		</view>
		<!-- end 黄金会员 -->
		<view class="cu-bar bg-white tabbar border shop">
			<view class="money align-center justify-start flex margin-left">实付金额:<view class="red">{{aMoney}}</view></view>
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
				scrollLeft: 0,
				tab:{63:'黄金会员',65:'钻石会员'},
				huangjin:[20,58,108,198], // 黄金会员价格
				zuanshi:[50,148,498], // 钻石会员价格
				pcid:63,
				num:0,
				payOpen:false,
				userInfo:{},
				payType:1,
				discount:'',
				aMoney:0,
				businessPay:false,
				cardList:{},
				cardId:-1,
				cardIndex:-1,
				oldMoney:0,
				use:false,
				account:'',
				errTxt:''
			};
		},
		created() {
			this.getUserInfo().then(res => {
				if(res.code == 200) {
					this.userInfo = res.data.data
					if(typeof(this.userInfo.shangwu_rabc) != 'undefined' && this.userInfo.shangwu_rabc > 1){
						this.businessPay = true
					}
				}
			}),
			this.initData()
		},
		onLoad() {
			uni.$on('changeOpen',(e)=>{ // 加载支付收银台
				this.payOpen = e
			})
			uni.$on('sendPwd',(e)=>{ // 加载输入密码框
				this.applyTo(e)
			})
		},
		onUnload() {
			uni.$off('changeOpen')
			uni.$off('sendPwd')
		},
		methods: {			
			initData() { // 初始化数据
				this.checkRechargeStatus();
				this.getCardList();
			},
			checkRechargeStatus(){ // 检查充值状态
				this.$http.get('/v1/check/recharge/status/wyykt').then(res => {
					if (res.data.code == 200) {
						this.use = res.data.data.status
						if (!this.use) {
							this.showMessage('充值已被关闭')
						}
					} else {
						this.showMessage(res.data.message)
						return;
					}
				})
			},
			tabSelect(e) { // 选项卡切换
				this.pcid = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.initData();
			},
			checkCard(key,e) { // 选择会员卡
				this.cardId = e
				this.cardIndex = key
				this.getDiscount()
			},
			checkPayType(e) { // 选择支付方式
				this.payType = e
				this.getDiscount()
			},		
			getCardList(){ // 获取会员卡列表
				this.$http.get('v1/recharge/card/limit/id?pcid='+ this.pcid).then(res => {
					if (res.data.code == 200) {
						this.cardList = res.data.data.data	
						if(this.cardList.length > 0){ // 默认设置
							this.cardIndex = 0
							this.cardId = this.cardList[this.cardIndex].id
							this.getCardPrice()
							this.getDiscount()
						}					
					} else {
						this.showMessage('获取会员卡失败，请刷新重试s')
						this.use = false
					}
				})
			},
			getCardPrice(){ // 获取实付金额
				if(this.pcid == 65){
					this.oldMoney = this.zuanshi[this.cardIndex]
				} else {
					this.oldMoney = this.huangjin[this.cardIndex]
				}
			},
			getDiscount(){ // 获取折扣
				this.$http.get('/v1/recharge/card/discount?pcid=' + this.pcid).then(res => {
					if(res.data.code == 200){
						if(this.payType == 2){
							this.discount = res.data.data.data.disRate * 10
						} else {
							this.discount = res.data.data.data.rate * 10
						}
						this.getCardPrice()
						this.handMoney()
					} else {
						this.showMessage('获取折扣失败，请刷新页面')
						this.use = false
					}
				})
			},
			handMoney() { // 计算实付金额
				this.aMoney = this.oldMoney * this.discount / 10
				if (isNaN(this.aMoney)) {
					this.aMoney = 0
				} else {
					this.aMoney = this.formatMoney(this.aMoney)
				}
			},
			toPay() { // 立即支付
				if(!this.use) {
					return
				}
				if(this.cardId == -1){
					this.showMessage('请选择开通时长')
					return
				}
				if(this.account == ''){
					this.showMessage('请输入充值账号')
					return
				}
				this.payOpen = true
			},
			applyTo(e){ // 提交支付
				this.$http.post('/v1/aiqiyi/recharge',{
					pcid:this.pcid,
					mid:this.cardId,
					payway:this.pcid,
					paypwd:e,
					username:this.account
				}).then(res => {
					// 提交充值消息，延时1秒执行，防止消息提交过快
					let msg = "会员类型:" + this.tab[this.pcid] + ",开通时长:" + this.cardList[this.cardIndex].point + ",充值账号:" + this.account + ",支付方式:" + this.payType + ",充值折扣:" + this.discount + ",实付金额:" + this.aMoney
					let that = this
					let terOut = setInterval(()=>{
						that.postMessageTxt('爱奇艺会员充值',msg)
						clearInterval(terOut)
					}, 1000)
					
					if(res.data.code == 200){
						unit.$emit('payBack',true)
					} else if (res.data.data == 10020) {
						this.showMessage('订单已提交，请耐心等待支付结果')
						let id = res.data.data.order
						this.timeLoop = setInterval(()=>{
							this.searchOrder(id)
						},3000)
					} else {
						uni.$emit("payBack",false)
						this.errTxt = res.data.message
					}
				})
			},
			searchOrder(){ // 查询订单是否支付成功
				this.$http.get("/v1/order/search",{params:{id:e}}).then(res => {
					if (res.data.code == 200) {
						clearInterval(this.timeLoop)
						uni.$emit("payBack",true)
					} else {
						this.showMessage(res.data.message)
					}
				})
			},
			showMessage(msg){ // 显示消息
				uni.showToast({
					icon:'none',
					position:'center',
					title:msg
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
