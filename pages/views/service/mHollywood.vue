<template>
	<view>
		<cu-header :isBack="true" :isMore="true">
			<block slot="backText"></block>
			<block slot="tap">
				<scroll-view scroll-x class="nav text-center ">
					<view class="cu-item text-lg text-bold" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tab" :key="index" @tap="tabSelect" :data-id="index">
						{{tab[index]}}
					</view>
				</scroll-view>
			</block>
		</cu-header>
		<!-- start 好莱坞会员 -->
		<view v-show="TabCur == 0">
			<view class="cu-form-group">
				<view class="title text-bold">开通时长</view>
			</view>
			<view class="cu-form-group" @click="selectOne(index)" v-for="(val,index) in cardList" :key="index" >
				<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>{{val}}</view>
				<view class="title"><checkbox v-show="thisCheck == index"  class="round checked" checked="true"></checkbox></view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">充值账号</view>
				<input class="uni-input" placeholder="请输入充值账号" />
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">久币支付(余额:121515.0)</view>
				<view class="title"><checkbox class="round checked" checked="true" value="B"></checkbox></view>
			</view>
			<view class="cu-form-group">
				<view class="title">商务币支付(余额:)</view>
				<view class="title"></view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">充值折扣</view>
				<view class="title text-red">9.7折</view>
			</view>
		</view>
		<!-- end 好莱坞会员 -->
		<!-- start 好莱坞超级会员 -->
		<view v-show="TabCur == 1">
			<view class="cu-form-group">
				<view class="title text-bold">开通时长</view>
			</view>
			<view class="cu-form-group">
				<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>月卡</view>
				<view class="title"><checkbox class="round checked" checked="true" value="B"></checkbox></view>
			</view>
			<view class="cu-form-group">
				<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>季卡</view>
			</view>
			<view class="cu-form-group">
				<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>年卡</view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">充值账号</view>
				<input class="uni-input" placeholder="请输入充值账号" />
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">久币支付(余额:121515.0)</view>
				<view class="title"><checkbox class="round checked" checked="true" value="B"></checkbox></view>
			</view>
			<view class="cu-form-group">
				<view class="title">商务币支付(余额:)</view>
				<view class="title"></view>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">充值折扣</view>
				<view class="title text-red">9.7折</view>
			</view>
		</view>
		<!-- end 好莱坞超级会员 -->
		<view class="cu-bar bg-white tabbar border shop">
			<view class="money align-center justify-start flex margin-left">实付金额:<view class="red">0</view></view>
			<view class="bg-red submit" @click="toPay()">立即支付</view>
		</view>
		<pay :open="payOpen"></pay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mid:'100',
				TabCur: 0,
				scrollLeft: 0,
				tab:['好莱坞会员','好莱坞超级会员'],
				num:0,
				cardList:['月卡','季卡','半年卡','年卡'],
				payOpen:false,
				thisCheck:0
			};
		},
		created() {
			uni.$on('changeOpen',(e)=>{
				this.payOpen = e
			})
		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			toPay() {
				this.payOpen = true
			},
			chooseCheckbox(e) {
				let items = this.checkbox;
				let values = e.currentTarget.dataset.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].value == values) {
						items[i].checked = !items[i].checked;
						break
					}
				}
			},
			selectOne(e) {
				this.thisCheck = e
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
