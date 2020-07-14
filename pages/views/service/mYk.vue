<template>
	<view>
		<cu-header :isBack="true">
			<block slot="content">优酷土豆黄金会员</block>
		</cu-header>
		<view class="cu-form-group">
			<view class="title text-bold">开通时长</view>
		</view>
		<view class="cu-form-group">
			<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>1月</view>
			<view class="title"><checkbox class="round checked" checked="true" value="B"></checkbox></view>
		</view>
		<view class="cu-form-group">
			<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>3月</view>
		</view>
		<view class="cu-form-group">
			<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>6月</view>
		</view>
		<view class="cu-form-group">
			<view class="title"><view class="cu-avatar sm margin-right" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>12月</view>
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
				num:0,
				payOpen:false
			};
		},
		created() {
			uni.$on('changeOpen',(e)=>{
				this.payOpen = e
			})
		},
		methods: {
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
